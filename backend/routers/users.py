from fastapi import APIRouter, Depends, HTTPException

from backend.core.security import get_current_user
from backend.services.firestore_service import get_mood_history, save_mood_entry

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/mood")
async def get_my_mood(current_user=Depends(get_current_user)):
    return {"entries": get_mood_history(current_user["uid"])}


@router.post("/me/mood")
async def log_my_mood(value: int, current_user=Depends(get_current_user)):
    if value < 1 or value > 5:
        raise HTTPException(status_code=400, detail="Mood must be between 1 and 5")
    entry = save_mood_entry(current_user["uid"], value)
    return {"entry": entry}

