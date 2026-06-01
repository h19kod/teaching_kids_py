from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    username: str
    display_name: Optional[str] = None
    avatar: Optional[str] = "🦁"


class UserCreate(UserBase):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: str = "child"
    parent_id: Optional[int] = None


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    preferred_language: Optional[str] = None
    dark_mode: Optional[bool] = None
    sound_enabled: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    email: Optional[str] = None
    role: str
    xp: int
    level: int
    coins: int
    stars: int
    gems: int
    streak_days: int
    bio: Optional[str] = None
    preferred_language: str = "ar"
    dark_mode: bool = False
    sound_enabled: bool = True
    parent_id: Optional[int] = None
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    id: int
    username: str
    display_name: Optional[str] = None
    avatar: Optional[str] = "🦁"
    level: int
    xp: int

    class Config:
        from_attributes = True


class ChildCreate(BaseModel):
    username: str
    display_name: Optional[str] = None
    avatar: Optional[str] = "🦁"


class PasswordChange(BaseModel):
    current_password: str
    new_password: str
