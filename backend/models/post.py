from typing import Dict, Literal, Optional
from pydantic import BaseModel, Field


MoodTag = Literal["sad", "anxious", "frustrated", "numb", "hopeful"]


class DistressResult(BaseModel):
    score: int = Field(ge=0, le=100)
    level: Literal["low", "medium", "high", "critical"]


class PostCreate(BaseModel):
    content: str = Field(min_length=1, max_length=1000)
    moodTag: Optional[MoodTag] = None
    imageUrls: list[str] = []


class PostResponse(BaseModel):
    id: str
    content: str
    userId: str
    userRole: str
    alias: str
    createdAt: str
    reactionCounts: Dict[str, int]
    userReaction: Optional[str] = None
    commentCount: int
    distress: Optional[DistressResult] = None
    moodTag: Optional[MoodTag] = None
    imageUrls: list[str] = []
