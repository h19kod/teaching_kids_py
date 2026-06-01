from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    display_name: Optional[str] = None
    role: Optional[str] = "parent"


class ChildLoginRequest(BaseModel):
    child_id: int
    parent_token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
    username: str
    display_name: Optional[str] = None
    avatar: Optional[str] = "🦁"
    xp: int = 0
    level: int = 1
    coins: int = 0


class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None
