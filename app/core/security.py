"""
HiLearn AI Interview Prep - Security Utilities
================================================
JWT token management and password hashing for authentication.

Uses:
    - python-jose (HS256 JWT encoding/decoding)
    - passlib + bcrypt (password hashing)
    - FastAPI Depends() for route-level auth
"""
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from loguru import logger
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

# ─────────────────────────────────────────────────────────
# Password Hashing (bcrypt)
# ─────────────────────────────────────────────────────────

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """
    Hash a plain-text password using bcrypt.

    Args:
        plain_password: The raw password string from the user.

    Returns:
        Bcrypt-hashed password string (60 chars).
    """
    return _pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a bcrypt hash.

    Args:
        plain_password: The raw password string from the user.
        hashed_password: The stored bcrypt hash.

    Returns:
        True if the password matches, False otherwise.
    """
    return _pwd_context.verify(plain_password, hashed_password)


# ─────────────────────────────────────────────────────────
# JWT Token Management
# ─────────────────────────────────────────────────────────

def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload dict — must include at least ``sub`` (user_id)
              and ``role``.
        expires_delta: Custom expiry duration. Defaults to
                       ``ACCESS_TOKEN_EXPIRE_MINUTES`` from settings (24 h).

    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})

    token = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.algorithm,
    )
    logger.debug(
        "JWT created | sub={} | expires={}",
        data.get("sub", "?"),
        expire.isoformat(),
    )
    return token


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Args:
        token: The raw JWT string.

    Returns:
        Decoded payload dict.

    Raises:
        HTTPException 401: If the token is invalid, expired, or malformed.
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        return payload
    except JWTError as exc:
        logger.warning("JWT decode failed | error={}", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ─────────────────────────────────────────────────────────
# FastAPI Dependency — Extract Current User from JWT
# ─────────────────────────────────────────────────────────

_bearer_scheme = HTTPBearer(auto_error=True)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> Dict[str, Any]:
    """
    FastAPI dependency that extracts and validates the JWT from
    the ``Authorization: Bearer <token>`` header.

    Usage in routes::

        @router.get("/protected")
        async def protected(user: dict = Depends(get_current_user)):
            return {"user_id": user["sub"]}

    Returns:
        Decoded JWT payload dict containing ``sub`` (user_id),
        ``role``, ``exp``, and ``iat``.

    Raises:
        HTTPException 401: If token is missing, invalid, or expired.
        HTTPException 401: If token has been blacklisted (logged out).
    """
    token = credentials.credentials

    # Check if the token has been blacklisted (logged out)
    from app.services.auth_service import auth_service
    if auth_service.is_token_blacklisted(token):
        logger.warning("Blocked blacklisted token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)

    # Ensure required claims exist
    if not payload.get("sub"):
        logger.warning("JWT missing 'sub' claim")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user identifier.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload
