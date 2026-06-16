"""Gestion des comptes par le directeur (CRUD, isolé par établissement)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.security import hash_password, require_director
from db.session import get_db
from models import Role, User
from schemas import UserCreate, UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    director: User = Depends(require_director),
):
    return db.query(User).filter(User.school_id == director.school_id).all()


@router.post("", response_model=UserOut, status_code=201)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    director: User = Depends(require_director),
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=409, detail="Email déjà utilisé")
    if payload.role not in ("teacher", "director"):
        raise HTTPException(status_code=400, detail="Rôle invalide")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
        role=Role(payload.role),
        school_id=director.school_id,  # même établissement, forcé
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    director: User = Depends(require_director),
):
    user = (
        db.query(User)
        .filter(User.id == user_id, User.school_id == director.school_id)
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    if user.id == director.id:
        raise HTTPException(status_code=400, detail="Impossible de se supprimer soi-même")
    db.delete(user)
    db.commit()
