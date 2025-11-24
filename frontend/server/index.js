import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import tcpPortUsed from 'tcp-port-used';
import { createServer as createViteServer } from 'vite';
import { CompressionStream } from 'node:stream/web';

const {
  NODE_ENV = 'development',
  PORT = '3001',
  PROXY_URL,
  MAIN_APP_URL,
  VITE_OMNI_TOKEN,
} = process.env;

const isDev = NODE_ENV !== 'production';

const normalizeTarget = (val, fallback = 'http://localhost:8000') => {
  if (!val) return fallback;
  if (!/^https?:\/\//i.test(val)) return `http://${val}`;
  return val;
};

const exposePort = (port) => {
  tcpPortUsed.check(port, 'localhost').then((inUse) => {
    if (inUse) {
      if (!isDev) throw new Error(`Port ${port} is in use`);
      console.log(`Port ${port} is in use, trying ${port + 1}`);
      exposePort(port + 1);
    } else {
      createServer(port).catch((err) => {
        console.error('Server failed to start:', err);
        process.exit(1);
      });
    }
  });
};

const createServer = async (port) => {
  const app = express();

  if (!isDev) {
    app.disable('x-powered-by');
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(CompressionStream());
  }

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (PROXY_URL) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: normalizeTarget(PROXY_URL),
        changeOrigin: true,
        xfwd: true,
      }),
    );
  }

  const targetOmnitron = normalizeTarget(MAIN_APP_URL);
  app.use(
    '/omnitronApi',
    createProxyMiddleware({
      target: targetOmnitron,
      changeOrigin: true,
      xfwd: true,
      secure: !isDev,
      pathRewrite: { '^/omnitronApi': '/api' },
      logLevel: isDev ? 'debug' : 'warn',
      onProxyReq: (proxyReq, req) => {
        delete req.headers.authorization;
        delete req.headers.token;

        if (VITE_OMNI_TOKEN) {
          const authVal = VITE_OMNI_TOKEN.startsWith('Token ') ? VITE_OMNI_TOKEN : `Token ${VITE_OMNI_TOKEN}`;
          proxyReq.setHeader('authorization', authVal);
          proxyReq.setHeader('token', VITE_OMNI_TOKEN);
        }
      },
      onError: (err, req, res) => {
        console.error('[/omnitronApi] proxy error:', err.message);
        if (!res.headersSent) res.status(502).json({ error: 'Upstream error' });
      },
    }),
  );

  if (isDev) {
    const vite = await createViteServer({ server: { middlewareMode: true } });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const publicPath = path.join(process.cwd(), 'public');

    app.use(
      express.static(distPath, {
        etag: true,
        maxAge: '1y',
        immutable: true,
        index: false,
      }),
    );
    app.use(express.static(publicPath, { etag: true, maxAge: '7d' }));

    app.get('*', (_, res) => {
      res.setHeader('Cache-Control', 'no-store');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(port, () =>
    console.log(`Server is running on http://localhost:${port} (mode=${NODE_ENV})`),
  );

  const shutdown = () => {
    console.log('Shutting down...');
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

exposePort(process.env.PORT ? parseInt(process.env.PORT) : 3001);
