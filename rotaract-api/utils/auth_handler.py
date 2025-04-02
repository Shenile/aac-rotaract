import uuid
import time
from fastapi import Request, Response, HTTPException
from functools import wraps
from dotenv import load_dotenv
import os

load_dotenv()

sessions = {}

SESSION_EXPIRY_TIME = int(os.getenv("SESSION_EXPIRY_TIME"))

def create_session():
    """Generate a new session ID with an expiry timestamp."""
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"role": "admin", "expires_at": time.time() + SESSION_EXPIRY_TIME}
    return session_id

def validate_session(session_id: str):
    """Check if the session is valid and not expired."""
    session = sessions.get(session_id)
    if not session or time.time() > session["expires_at"]:
        sessions.pop(session_id, None)
        return None
    return session

def session_required(func):
    """Decorator to protect routes using session authentication."""

    @wraps(func)
    async def wrapper(*args, **kwargs):
        request: Request = kwargs.get("request")
        if not request:
            raise HTTPException(status_code=400, detail="Request object is missing")

        print(f'Cookies: {request.cookies}, session_id: {request.cookies.get("session_id")}')
        session_id = request.cookies.get("session_id")
        session = validate_session(session_id)

        if not session:
            raise HTTPException(status_code=401, detail="Unauthorized or session expired")

        return await func(*args, **kwargs)

    return wrapper




