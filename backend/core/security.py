"""Hachage de mots de passe + JWT + dépendance get_current_user."""
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from config import settings
from db.session import get_db
from models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user: User) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": str(user.id),
        "user_id": user.id,
        "role": user.role.value if hasattr(user.role, "value") else user.role,
        "school_id": user.school_id,
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    creds_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expiré",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id = payload.get("user_id")
        if user_id is None:
            raise creds_error
    except JWTError:
        raise creds_error

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise creds_error
    return user


def require_director(user: User = Depends(get_current_user)) -> User:
    """Dépendance : réserve la route aux directeurs."""
    role = user.role.value if hasattr(user.role, "value") else user.role
    if role != "director":
        raise HTTPException(status_code=403, detail="Réservé au directeur")
    return user
