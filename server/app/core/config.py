from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    APP_NAME: str = "Kids Learning Adventure"
    DEBUG: bool = True
    SECRET_KEY: str = "kids-learning-adventure-super-secret-key-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = "sqlite:///./kids_learning.db"
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:3000","http://127.0.0.1:5173"]'

    def get_cors_origins(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    class Config:
        env_file = ".env"


settings = Settings()
