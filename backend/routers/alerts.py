"""Alertes : création + diffusion temps réel via WebSocket."""
import httpx
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, BackgroundTasks
from jose import JWTError
from sqlalchemy.orm import Session, joinedload

from core.security import decode_token, get_current_user
from db.session import SessionLocal, get_db
from models import Alert, User
from schemas import AlertCreate, AlertOut
from websocket.manager import manager

router = APIRouter(tags=["alerts"])


@router.post("/alerts", response_model=AlertOut)
async def create_alert(
    payload: AlertCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    alert = Alert(
        type=payload.type,
        school_id=current.school_id,
        triggered_by=current.id,
        active=True,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Diffusion instantanée à tout l'établissement
    await manager.broadcast(
        current.school_id,
        {
            "event": "new_alert",
            "alert": {
                "id": alert.id,
                "type": alert.type,
                "school_id": alert.school_id,
                "triggered_by": alert.triggered_by,
                "active": alert.active,
                "created_at": alert.created_at.isoformat() if alert.created_at else None,
                "triggering_user": {
                    "id": current.id,
                    "full_name": current.full_name,
                    "email": current.email,
                    "role": current.role.value if hasattr(current.role, "value") else current.role,
                    "school_id": current.school_id,
                }
            },
        },
    )

    # Notifications Push
    users = db.query(User).filter(User.school_id == current.school_id, User.push_token.isnot(None)).all()
    tokens = [u.push_token for u in users]
    if tokens:
        sound_file = f"{payload.type}.wav" if payload.type != "intrusion" else "default"
        background_tasks.add_task(send_push_notifications, tokens, payload.type, sound_file)

    return alert


async def send_push_notifications(tokens: list[str], alert_type: str, sound: str):
    messages = [
        {
            "to": t,
            "sound": sound,
            "title": f"🚨 ALERTE {alert_type.upper()}",
            "body": "Une alerte a été déclenchée dans votre établissement !",
            "data": {"type": alert_type},
            "_displayInForeground": True,
            "channelId": "alerts",
        }
        for t in tokens
    ]
    async with httpx.AsyncClient() as client:
        try:
            await client.post("https://exp.host/--/api/v2/push/send", json=messages)
        except Exception as e:
            print(f"Push error: {e}")


@router.post("/alerts/{alert_id}/stop", response_model=AlertOut)
async def stop_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id, Alert.school_id == current.school_id)
        .first()
    )
    if not alert:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Alerte introuvable")
    alert.active = False
    db.commit()
    db.refresh(alert)

    await manager.broadcast(
        current.school_id,
        {"event": "stop_alert", "alert_id": alert.id},
    )
    return alert


@router.get("/alerts/active", response_model=list[AlertOut])
def active_alerts(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    return (
        db.query(Alert)
        .options(joinedload(Alert.triggering_user))
        .filter(Alert.school_id == current.school_id, Alert.active.is_(True))
        .order_by(Alert.created_at.desc())
        .all()
    )


@router.websocket("/ws")
async def alerts_ws(websocket: WebSocket, token: str = ""):
    """WebSocket d'écoute des alertes. Le token JWT est passé en query param (?token=...)."""
    try:
        payload = decode_token(token)
        school_id = int(payload["school_id"])
    except (JWTError, KeyError, ValueError):
        await websocket.close(code=4001)
        return

    await manager.connect(school_id, websocket)
    try:
        # On renvoie l'alerte active courante à la connexion, le cas échéant
        db = SessionLocal()
        try:
            current = (
                db.query(Alert)
                .options(joinedload(Alert.triggering_user))
                .filter(Alert.school_id == school_id, Alert.active.is_(True))
                .order_by(Alert.created_at.desc())
                .first()
            )
            if current:
                await websocket.send_json(
                    {
                        "event": "new_alert",
                        "alert": {
                            "id": current.id,
                            "type": current.type,
                            "school_id": current.school_id,
                            "triggered_by": current.triggered_by,
                            "active": current.active,
                            "created_at": current.created_at.isoformat()
                            if current.created_at
                            else None,
                            "triggering_user": {
                                "id": current.triggering_user.id,
                                "full_name": current.triggering_user.full_name,
                                "email": current.triggering_user.email,
                                "role": current.triggering_user.role.value if hasattr(current.triggering_user.role, 'value') else current.triggering_user.role,
                                "school_id": current.triggering_user.school_id,
                            } if current.triggering_user else None,
                        },
                    }
                )
        finally:
            db.close()

        # Garde la connexion ouverte (ping/pong applicatif)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(school_id, websocket)
