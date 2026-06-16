"""Point d'entrée FastAPI — Alerte École (backend local)."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.session import Base, engine
from routers import alerts, auth, users

# Crée les tables si elles n'existent pas (en plus de db/init.sql côté MySQL)
import models  # noqa: F401  (enregistre les modèles sur Base)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Alerte École API", version="1.0.0")

# CORS large : on tourne en local (web + mobiles du réseau)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(users.router)


@app.get("/health")
def health():
    return {"status": "ok"}
