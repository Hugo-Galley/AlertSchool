"""Schémas Pydantic (contrats d'API)."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


# --- Auth ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


# --- Users ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "teacher"


class PushTokenUpdate(BaseModel):
    push_token: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    role: str
    school_id: int
    push_token: str | None = None


# --- Alerts ---
class AlertCreate(BaseModel):
    type: str  # incendie / intrusion / confinement / medical / exercice


class AlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    school_id: int
    triggered_by: int
    active: bool
    created_at: datetime
    triggering_user: UserOut | None = None


TokenResponse.model_rebuild()
