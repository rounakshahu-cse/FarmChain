import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import jwt
import bcrypt
from backend.app.core.config import settings

# Legacy pre-hardening scheme: salted SHA-256. Kept ONLY to verify hashes
# created by the old codebase; stored hashes are transparently upgraded to
# bcrypt on successful login.
_LEGACY_SALT = "krishi_secure_salt_2026"

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def _verify_legacy(plain_password: str, hashed_password: str) -> bool:
    expected_hash = hashlib.sha256((_LEGACY_SALT + plain_password).encode("utf-8")).hexdigest()
    return hmac.compare_digest(expected_hash, hashed_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    if is_legacy_hash(hashed_password):
        return _verify_legacy(plain_password, hashed_password)
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except (ValueError, TypeError):
        return False

def is_legacy_hash(hashed_password: str) -> bool:
    return bool(hashed_password) and len(hashed_password) == 64 and all(
        c in "0123456789abcdef" for c in hashed_password.lower()
    )

def create_access_token(subject: str | Any, role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None