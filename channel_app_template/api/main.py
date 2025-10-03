from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from channel_app_template.api.middlewares import OmnitronAuthenticationMiddleware
from channel_app_template.api.routes import router as log_router

app = FastAPI()
app.add_middleware(OmnitronAuthenticationMiddleware)
app.include_router(log_router, prefix="/api", tags=["log"])
app.mount("/api/exports", StaticFiles(directory="channel_app_template/api/exports"), name="exports")
