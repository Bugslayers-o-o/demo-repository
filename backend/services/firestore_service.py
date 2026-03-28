"""
Abstractions over Firestore reads/writes plus helper utilities
like anonymous alias generation.
"""

import random
from datetime import datetime, timezone
from typing import Dict, Optional

from backend.core.firebase import get_db

# Simple word lists for anonymous alias generation
ADJECTIVES = [
    "Calm",
    "Quiet",
    "Gentle",
    "Brave",
    "Kind",
    "Steady",
    "Bright",
    "Soft",
    "Hopeful",
    "Patient",
    "Warm",
    "Luminous",
]

NATURE_NOUNS = [
    "River",
    "Moon",
    "Forest",
    "Horizon",
    "Breeze",
    "Summit",
    "Harbor",
    "Lagoon",
    "Valley",
    "Dawn",
    "Garden",
    "Meadow",
]


def generate_alias(seed: Optional[int] = None) -> str:
    rng = random.Random(seed)
    adjective = rng.choice(ADJECTIVES)
    noun = rng.choice(NATURE_NOUNS)
    suffix = rng.randint(7, 99)
    return f"{adjective}{noun}{suffix}"


def get_user_profile(uid: str) -> Optional[Dict]:
    db = get_db()
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        return None
    return doc.to_dict()


def ensure_user_profile(uid: str, email: Optional[str], default_role: str = "user"):
    """
    Create a minimal user profile if it doesn't exist yet,
    ensuring every user receives a stable anonymous alias.
    """
    db = get_db()
    doc_ref = db.collection("users").document(uid)
    snap = doc_ref.get()

    if snap.exists:
        data = snap.to_dict()
        # Backfill alias if missing
        if not data.get("alias"):
            data["alias"] = generate_alias(int(uid[-6:], 16) if len(uid) >= 6 else None)
            doc_ref.update({"alias": data["alias"]})
        return data

    alias = generate_alias(int(uid[-6:], 16) if len(uid) >= 6 else None)
    created_at = datetime.now(timezone.utc).isoformat()
    profile = {
        "uid": uid,
        "email": email,
        "role": default_role,
        "alias": alias,
        "createdAt": created_at,
    }
    doc_ref.set(profile)
    return profile


def save_mood_entry(uid: str, mood: int):
    """Store a daily mood entry for the user."""
    db = get_db()
    entry = {
        "value": mood,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    db.collection("users").document(uid).collection("moods").add(entry)
    return entry


def get_mood_history(uid: str, limit: int = 30):
    """Fetch recent mood entries (default last 30)."""
    db = get_db()
    entries = []
    moods_ref = (
        db.collection("users")
        .document(uid)
        .collection("moods")
        .order_by("createdAt", direction="DESCENDING")
        .limit(limit)
    )
    for doc in moods_ref.stream():
        entries.append(doc.to_dict())
    return entries[::-1]  # return chronological

