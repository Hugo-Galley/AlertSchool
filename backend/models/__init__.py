"""Modèles SQLAlchemy."""
import enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import relationship

from db.session import Base


class Role(str, enum.Enum):
    teacher = "teacher"
    director = "director"


class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)

    users = relationship("User", back_populates="school")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(Role), nullable=False, default=Role.teacher)
    created_at = Column(DateTime, server_default=func.now())

    school = relationship("School", back_populates="users")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False, index=True)
    type = Column(String(50), nullable=False)
    triggered_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, server_default=func.now())
