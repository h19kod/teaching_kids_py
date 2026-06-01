from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token, create_child_token
from app.core.config import settings
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


class AuthService:

    @staticmethod
    def login(db: Session, data: LoginRequest) -> TokenResponse:
        user = db.query(User).filter(
            (User.email == data.email) | (User.username == data.email)
        ).first()
        if not user or not user.hashed_password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not verify_password(data.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is deactivated")

        user.last_login = datetime.utcnow()
        db.commit()

        token = create_access_token({"sub": str(user.id), "role": user.role})
        return TokenResponse(
            access_token=token,
            user_id=user.id,
            role=user.role,
            username=user.username,
            display_name=user.display_name,
            avatar=user.avatar,
            xp=user.xp,
            level=user.level,
            coins=user.coins,
        )

    @staticmethod
    def register(db: Session, data: RegisterRequest) -> TokenResponse:
        existing = db.query(User).filter(
            (User.email == data.email) | (User.username == data.username)
        ).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

        hashed = get_password_hash(data.password)
        user = User(
            username=data.username,
            email=data.email,
            hashed_password=hashed,
            display_name=data.display_name or data.username,
            role=data.role if data.role in ("admin", "parent") else "parent",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token({"sub": str(user.id), "role": user.role})
        return TokenResponse(
            access_token=token,
            user_id=user.id,
            role=user.role,
            username=user.username,
            display_name=user.display_name,
            avatar=user.avatar,
            xp=user.xp,
            level=user.level,
            coins=user.coins,
        )

    @staticmethod
    def child_login(db: Session, child_id: int, parent: User) -> TokenResponse:
        child = db.query(User).filter(
            User.id == child_id,
            User.parent_id == parent.id,
            User.role == "child",
        ).first()
        if not child:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Child not found")

        child.last_login = datetime.utcnow()
        db.commit()

        token = create_child_token(child.id, parent.id)
        return TokenResponse(
            access_token=token,
            user_id=child.id,
            role=child.role,
            username=child.username,
            display_name=child.display_name,
            avatar=child.avatar,
            xp=child.xp,
            level=child.level,
            coins=child.coins,
        )
