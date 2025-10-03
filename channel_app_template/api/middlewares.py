from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from channel_app_template.akinon.integration import OmnitronIntegration


class OmnitronAuthenticationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Token "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing or invalid Authorization header"},
            )

        token = auth_header.split(" ")[1]

        with OmnitronIntegration() as omnitron_integration:
            omnitron_token = omnitron_integration.channel.conf.get("token")
            if token != omnitron_token:
                return JSONResponse(
                    status_code=403, content={"detail": "Invalid or expired token"}
                )

        return await call_next(request)