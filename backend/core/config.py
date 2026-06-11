import os

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-mock-auth")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

settings = Settings()
