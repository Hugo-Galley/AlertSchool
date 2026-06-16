"""Configuration centrale du backend (variables d'environnement)."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Base de données (MySQL via Docker par défaut)
    database_url: str = "mysql+mysqlconnector://alerte:alerte@127.0.0.1:3307/alerte_ecole"

    # JWT
    jwt_secret: str = "dev-secret-a-changer-en-prod"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 12  # 12h

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
