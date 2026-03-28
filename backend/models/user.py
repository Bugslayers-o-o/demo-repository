from typing import Optional
from pydantic import BaseModel


class UserProfile(BaseModel):
    uid: str
    email: Optional[str] = None
    displayName: Optional[str] = None
    role: str = "user"
    alias: str
    createdAt: str

