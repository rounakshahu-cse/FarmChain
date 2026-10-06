from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import (
    get_password_hash,
    verify_password,
    is_legacy_hash,
    create_access_token,
    decode_access_token,
)
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserLogin, UserOut, Token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

# Roles users may self-register with. Admin accounts can only be provisioned
# via the seeded demo data (or directly by an operator).
ALLOWED_REGISTER_ROLES = {"farmer", "merchant", "transporter", "seller"}

# IDs of the pre-seeded demo personas used by the 1-click demo switcher.
# Only these may be minted tokens via /switch-demo.
DEMO_USER_IDS = set(range(1, 11))

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = int(payload["sub"])
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def require_roles(*roles: str):
    """Dependency factory: allow only the given roles (checked against the DB user).
    Admins are always permitted."""
    allowed = set(roles)

    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != "admin" and current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return current_user

    return role_checker

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    role = user_in.role.lower().strip()
    if role not in ALLOWED_REGISTER_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be one of: farmer, merchant, transporter, seller",
        )

    existing = db.query(User).filter(
        (User.phone == user_in.phone) | (User.email == user_in.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this phone or email already exists"
        )
    
    new_user = User(
        name=user_in.name,
        phone=user_in.phone,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=role,
        location=user_in.location,
        district=user_in.district or user_in.location.split(",")[0],
        state=user_in.state,
        trust_score=4.8,
        total_deals=0,
        verified=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.id, role=new_user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.phone == login_data.phone_or_email) | (User.email == login_data.phone_or_email)
    ).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone/email or password"
        )

    # Transparently upgrade legacy SHA-256 hashes to bcrypt on successful login
    if is_legacy_hash(user.hashed_password):
        user.hashed_password = get_password_hash(login_data.password)
        db.commit()

    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/demo-users", response_model=List[UserOut])
def get_demo_users(db: Session = Depends(get_db)):
    """Returns the pre-seeded demo personas for 1-click fast demo switching.
    Registered (non-demo) users are never exposed here."""
    users = db.query(User).filter(User.id.in_(DEMO_USER_IDS)).order_by(User.id.asc()).all()
    return users

@router.post("/switch-demo/{user_id}", response_model=Token)
def switch_demo_user(user_id: int, db: Session = Depends(get_db)):
    if user_id not in DEMO_USER_IDS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only demo personas can be switched to",
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demo user not found")
    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }
