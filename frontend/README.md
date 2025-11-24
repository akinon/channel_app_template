<p align="center">
  <br />
  <br />
  <br />
  <a href="https://akinon.com" target="_blank">
    <img alt="Akinon Logo" src="./public/akinon-logo.svg" height="40">
  </a>

  <h3 align="center">channel-app-fe</h3>

  <p align="center">
    A fullpage client application built with Akinon's UI Protocol.
  </p>
  <br />
  <br />
</p>

## ℹ️ About the Project

This is a fullpage client application that takes over the entire page when activated. It's built using React, TypeScript, and Akinon's UI Protocol system.

## 🚀 Quick Start

### Prerequisites

- Node.js (see `.nvmrc` for the exact version)
- Package manager (pnpm recommended, but npm and yarn also work)

### Installation & Development

```bash
# Install dependencies
 install

# Start development server
 run dev

# Open your browser to http://localhost:3001
```

## 📁 Project Structure

```

server/
└── index.js                    # Express dev server + proxy (token injection tavsiye)

src/
├── api/                        # Axios clients, thunks
│   └── client.ts
├── components/                 # Reusable UI components
│   └── Loading.tsx             # Example loading component
├── hooks/                      # Custom React hooks
│   ├── index.tsx               # Hook exports
│   └── useConfig.tsx           # Configuration hook
├── pages/                      # Page components
│   ├── Home/index.tsx          # Home page component
│   ├── Dashboard/index.tsx     # Dashboard page component
│   ├── Log/index.tsx           # Log page component
│   ├── Report/index.tsx        # Report page component
│   ├── Alarm/index.tsx         # Alarm page component
│   └── Trigger/index.tsx       # Trigger page component
├── store/                      # Redux Toolkit store & slices
│   ├── store.ts
│   ├── hooks.ts
│   ├── logs-slice.ts
│   └── ui-slice.ts
├── utils/                      # Utility functions
├── App.tsx                     # Main app component
├── AppWrapper.tsx              # App wrapper with providers
├── config.ts                   # Fullpage application config (with i18n labels)
├── main.tsx                    # App entry point
├── main.scss                   # Global styles
├── pageMeta.ts                 # Page meta & menu/card information (single source)
├── providers.tsx               # AppClient + UI providers
└── routes.tsx                  # Router (lazy-loaded pages)
__tests__/                      # Unit tests
public/
└── akinon-logo.svg

```

### Key Files

- **`src/config.ts`** - Application configuration and settings
- **`src/hooks/useConfig.tsx`** - Configuration hook for accessing app settings
- **`src/providers.tsx`** - Context providers for state management
- **`src/routes.tsx`** - Route definitions using React Router
- **`shell.config.js`** - Shell server configuration for development

## 🛠️ Development Scenarios

### Adding a New Route

1. Create a new page component:

```tsx
// src/pages/About/index.tsx
export const PageAbout = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page.</p>
    </div>
  );
};
```

2. Export it from pages index:

```tsx
// src/pages/index.tsx
export { PageAbout } from "./About";
```

3. Add the route in `src/routes.tsx`:

```tsx
import { PageAbout } from "@/pages";

// Add this route
<Route path="/about" element={<PageAbout />} />;
```

### Adding a New Provider

1. Create your provider:

```tsx
// src/providers/ThemeProvider.tsx
import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const theme = { mode: "light" };
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
```

2. Add it to your providers stack in `src/providers.tsx`:

```tsx
import { ThemeProvider } from "./providers/ThemeProvider";

export const Providers = ({ children }) => (
  <AkinonUIProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </AkinonUIProvider>
);
```

### Adding a Reusable Component

1. Create your component:

```tsx
// src/components/Button/index.tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button onClick={onClick} className="custom-button">
      {children}
    </button>
  );
};
```

2. Export it from components index:

```tsx
// src/components/index.tsx
export { Button } from "./Button";
```

### Configuring the Application

Update `src/config.ts` to modify application settings:

```tsx
export const config = {
  apiUrl: process.env.VITE_API_URL || "http://localhost:3000",
  appName: "My Fullpage App",
  version: "1.0.0",
  features: {
    darkMode: true,
    analytics: false,
  },
};
```

Access configuration in components using the `useConfig` hook:

```tsx
import { useConfig } from "@/hooks/useConfig";

const MyComponent = () => {
  const config = useConfig();
  return <div>App Name: {config.appName}</div>;
};
```

### Adding Global Styles

Add your global styles to `src/main.scss`:

```scss
// Custom variables
:root {
  --primary-color: #d2282e;
  --secondary-color: #f98003;
}

// Global styles
.custom-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}
```

## 📦 Available Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `dev`           | Start development server (port 4001)       |
| `dev:shell`     | Start shell development server (port 4000) |
| `build`         | Build for production                       |
| `test`          | Run tests in watch mode                    |
| `test:run`      | Run tests once                             |
| `test:coverage` | Run tests with coverage report             |
| `test:ui`       | Run tests with UI                          |
| `lint`          | Run ESLint                                 |
| `format`        | Run Prettier                               |

## 🔧 Shell Integration

To integrate this app into a main application using the App Shell:

```tsx
import { AppShellProvider, type RegisteredApp } from '@akinon/app-shell';

const apps: RegisteredApp[] = [
  {
    url: "http://localhost:3001",
    slug: "channel-app-fe",
    path: "",
    type: "full_page",
  },
];

const App = () => {
  return (
    <AppShellProvider
      apps={apps}
      data={...}
      navigation={...}
      actions={...}
    >
      {/* Your application components go here */}
    </AppShellProvider>
  );
};
```

## 🧪 Testing

This template includes Vitest for testing with React Testing Library:

```tsx
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/Button";

test("calls onClick when clicked", () => {
  const mockClick = vi.fn();
  render(<Button onClick={mockClick}>Click me</Button>);

  fireEvent.click(screen.getByText("Click me"));
  expect(mockClick).toHaveBeenCalledTimes(1);
});
```

## 📚 Additional Resources

- [UI Protocol Documentation](https://5778b65bc6734b2fa6feaf0d5bd90b4d.lb.akinoncloud.com/)
- [Playground Repository](https://bitbucket.org/akinonteam/ui-protocol-playground)
- [Live Playground](https://e74f1f51d91f458d889619bcd495fdbd.lb.akinoncloud.com)
