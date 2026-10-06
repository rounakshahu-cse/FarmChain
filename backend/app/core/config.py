import os
import secrets
from typing import List


class Settings:
    PROJECT_NAME: str = "Smart Krishi Connect (FarmChain) API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # JWT signing key. MUST be overridden via SECRET_KEY env var in any
    # deployed environment. If unset, a random key is generated per process
    # (secure, but tokens are invalidated on restart).
    SECRET_KEY: str = os.getenv("SECRET_KEY") or secrets.token_hex(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7)))  # 7 days

    # SQLite Database for portable zero-setup run, compatible with Postgres URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./farmchain.db")

    # Allowed CORS origins (local dev servers). Override via CORS_ORIGINS (comma-separated).
    _default_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    CORS_ORIGINS: List[str] = [
        o.strip() for o in os.getenv("CORS_ORIGINS", ",".join(_default_origins)).split(",") if o.strip()
    ]


settings = Settings()
