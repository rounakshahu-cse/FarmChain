import os

class Settings:
    PROJECT_NAME: str = "Smart Krishi Connect (FarmChain) API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "krishi-connect-secret-key-2026-secure-jwt-auth-agri-token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SQLite Database for portable zero-setup run, compatible with Postgres URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./farmchain.db")

settings = Settings()
