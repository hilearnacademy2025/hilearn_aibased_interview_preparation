"""
HiLearn AI Interview Prep - Authentication Service
====================================================
Business logic for user signup, login, logout, and token refresh.

Day 4: JWT-based auth with bcrypt password hashing.                 ✅
Day 5: MongoDB persistence via DatabaseService — in-memory cache
       retained for fast reads, DB used for persistence.            ✅

Uses in-memory stores as cache; MongoDB is the source of truth
when available. Graceful fallback when MongoDB is unavailable.
"""
import re
import uuid
from datetime import datetime
from typing import Dict, Optional, Set

from loguru import logger

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.models.schemas import (
    AuthResponse,
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserInDB,
    UserProfile,
)

settings = get_settings()

# ─────────────────────────────────────────────────────────
# In-Memory Caches (fast reads; DB for persistence)
# ─────────────────────────────────────────────────────────
_user_store: Dict[str, UserInDB] = {}        # user_id -> UserInDB
_email_index: Dict[str, str] = {}            # email -> user_id (fast lookup)
_token_blacklist: Set[str] = set()           # revoked JWT tokens


# ─────────────────────────────────────────────────────────
# DB Service Lazy Import (avoids circular imports)
# ─────────────────────────────────────────────────────────
def _get_db_service():
    """
    Lazy import to avoid circular imports at module load time.

    Returns:
        The singleton DatabaseService instance.
    """
    from app.services.database import db_service
    return db_service


# ─────────────────────────────────────────────────────────
# Email Validation Helper
# ─────────────────────────────────────────────────────────
_EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)


def _is_valid_email(email: str) -> bool:
    """Validate email format using regex."""
    return bool(_EMAIL_REGEX.match(email))


# ─────────────────────────────────────────────────────────
# Password Strength Validation
# ─────────────────────────────────────────────────────────

def _validate_password_strength(password: str) -> Optional[str]:
    """
    Validate password meets security requirements.

    Returns:
        None if valid, or an error message string if invalid.
    """
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter."
    if not re.search(r"\d", password):
        return "Password must contain at least one digit."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Password must contain at least one special character (!@#$%^&* etc.)."
    return None


# ─────────────────────────────────────────────────────────
# Auth Service Class
# ─────────────────────────────────────────────────────────

class AuthService:
    """
    Authentication service handling user registration, login,
    logout, and token management.

    Day 5: All mutations are persisted to MongoDB via DatabaseService.
    In-memory stores are kept as a cache for fast lookups.
    Matches the singleton pattern used by InterviewService.
    """

    # ── Signup ────────────────────────────────────────────

    async def signup(self, payload: SignupRequest) -> AuthResponse:
        """
        Register a new user.

        Flow:
            1. Validate email format
            2. Check email uniqueness (in-memory + MongoDB)
            3. Validate password strength
            4. Hash password with bcrypt
            5. Store user in-memory + MongoDB
            6. Generate JWT access token
            7. Return AuthResponse

        Args:
            payload: SignupRequest with email, password, name, role.

        Returns:
            AuthResponse with user_id, token, role, message.

        Raises:
            HTTPException 400: Invalid email format or weak password.
            HTTPException 409: Email already registered.
        """
        from fastapi import HTTPException, status

        email = payload.email.lower().strip()
        logger.info("[SIGNUP] Attempting registration | email={}", email)

        # Validate email format
        if not _is_valid_email(email):
            logger.warning("[SIGNUP] Invalid email format | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format. Please provide a valid email address.",
            )

        # Check email uniqueness — in-memory first, then MongoDB
        if email in _email_index:
            logger.warning("[SIGNUP] Duplicate email (in-memory) | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists. Please log in instead.",
            )

        # Day 5: Also check MongoDB for existing email
        try:
            db = _get_db_service()
            if db.is_connected:
                existing = await db.get_user_by_email(email)
                if existing:
                    logger.warning("[SIGNUP] Duplicate email (MongoDB) | email={}", email)
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="An account with this email already exists. Please log in instead.",
                    )
        except HTTPException:
            raise  # re-raise HTTP exceptions
        except Exception as exc:
            logger.warning("[SIGNUP] MongoDB email check failed | error={} | continuing", exc)

        # Validate password strength
        password_error = _validate_password_strength(payload.password)
        if password_error:
            logger.warning("[SIGNUP] Weak password | email={} | reason={}", email, password_error)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=password_error,
            )

        # Hash password — NEVER store plain text
        hashed = hash_password(payload.password)

        # Create user record
        user_id = str(uuid.uuid4())
        user = UserInDB(
            user_id=user_id,
            email=email,
            name=payload.name.strip(),
            role=payload.role,
            hashed_password=hashed,
            created_at=datetime.utcnow(),
        )

        # Store in-memory cache
        _user_store[user_id] = user
        _email_index[email] = user_id

        # ── Day 5: Persist to MongoDB (non-blocking) ─────────────────────
        try:
            db = _get_db_service()
            if db.is_connected:
                from app.models.db_models import UserDocument
                user_doc = UserDocument(
                    user_id=user_id,
                    email=email,
                    password_hash=hashed,
                    name=payload.name.strip(),
                    role=payload.role.value,
                    created_at=user.created_at,
                )
                await db.create_user(user_doc)
                logger.info("[SIGNUP] User persisted to MongoDB | user_id={}", user_id)
        except Exception as exc:
            logger.warning("[SIGNUP] MongoDB persist failed | error={} | user still in-memory", exc)

        logger.success(
            "[SIGNUP] User registered | user_id={} | email={} | role={}",
            user_id, email, payload.role.value,
        )

        # Generate JWT
        token = create_access_token(
            data={"sub": user_id, "role": payload.role.value, "email": email}
        )

        return AuthResponse(
            user_id=user_id,
            token=token,
            role=payload.role.value,
            message=f"Welcome to HiLearn, {payload.name.strip()}! Account created successfully.",
        )

    # ── Login ─────────────────────────────────────────────

    async def login(self, payload: LoginRequest) -> AuthResponse:
        """
        Authenticate an existing user.

        Flow:
            1. Find user by email (in-memory cache → MongoDB fallback)
            2. Verify password against bcrypt hash
            3. Generate JWT access token
            4. Return AuthResponse

        Args:
            payload: LoginRequest with email, password.

        Returns:
            AuthResponse with user_id, token, role, message.

        Raises:
            HTTPException 401: Invalid email or password.
        """
        from fastapi import HTTPException, status

        email = payload.email.lower().strip()
        logger.info("[LOGIN] Attempting login | email={}", email)

        # Find user by email — try in-memory first, then MongoDB
        user = self.get_user_by_email(email)

        # Day 5: If not in cache, try MongoDB
        if not user:
            user = await self._get_user_from_db_by_email(email)

        if not user:
            logger.warning("[LOGIN] User not found | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify password
        if not verify_password(payload.password, user.hashed_password):
            logger.warning("[LOGIN] Wrong password | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        logger.success(
            "[LOGIN] Login successful | user_id={} | email={} | role={}",
            user.user_id, email, user.role.value,
        )

        # Generate JWT
        token = create_access_token(
            data={"sub": user.user_id, "role": user.role.value, "email": email}
        )

        return AuthResponse(
            user_id=user.user_id,
            token=token,
            role=user.role.value,
            message=f"Welcome back, {user.name}!",
        )

    # ── Logout ────────────────────────────────────────────

    async def logout(self, token: str) -> dict:
        """
        Invalidate a JWT token by adding it to the blacklist.

        Args:
            token: The JWT token string to revoke.

        Returns:
            Dict with success message.
        """
        _token_blacklist.add(token)
        logger.info("[LOGOUT] Token blacklisted | token_prefix={}...", token[:20])
        return {"message": "Logged out successfully. Token has been revoked."}

    # ── Refresh Token ─────────────────────────────────────

    async def refresh_token(self, token: str) -> TokenResponse:
        """
        Issue a new JWT token from a valid existing token.

        Flow:
            1. Decode the existing token
            2. Ensure it's not blacklisted
            3. Blacklist the old token
            4. Issue a fresh token with the same claims

        Args:
            token: Current valid JWT token.

        Returns:
            TokenResponse with new access_token.

        Raises:
            HTTPException 401: If token is invalid, expired, or blacklisted.
        """
        from fastapi import HTTPException, status

        # Check blacklist
        if self.is_token_blacklisted(token):
            logger.warning("[REFRESH] Attempted refresh with blacklisted token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked. Please log in again.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Decode (will raise 401 if invalid/expired)
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        role = payload.get("role")
        email = payload.get("email")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user identifier.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Blacklist old token
        _token_blacklist.add(token)

        # Issue new token
        new_token = create_access_token(
            data={"sub": user_id, "role": role, "email": email}
        )

        logger.success("[REFRESH] Token refreshed | user_id={}", user_id)
        return TokenResponse(access_token=new_token)

    # ── Get User Profile ──────────────────────────────────

    async def get_profile(self, user_id: str) -> UserProfile:
        """
        Retrieve a user's public profile by their ID.

        Checks in-memory cache first, then falls back to MongoDB.

        Args:
            user_id: The user's unique identifier.

        Returns:
            UserProfile (email, name, role, created_at).

        Raises:
            HTTPException 401: If user not found.
        """
        from fastapi import HTTPException, status

        user = self.get_user_by_id(user_id)

        # Day 5: If not in cache, try MongoDB
        if not user:
            user = await self._get_user_from_db_by_id(user_id)

        if not user:
            logger.warning("[PROFILE] User not found | user_id={}", user_id)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found. Token may be stale.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return UserProfile(
            user_id=user.user_id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at,
        )

    # ── Lookup Helpers (in-memory cache) ──────────────────

    def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """
        Find a user by their email address in the in-memory cache.

        Args:
            email: The email to search for.

        Returns:
            UserInDB if found, None otherwise.
        """
        user_id = _email_index.get(email.lower().strip())
        if user_id:
            return _user_store.get(user_id)
        return None

    def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """
        Find a user by their unique ID in the in-memory cache.

        Args:
            user_id: The user_id to search for.

        Returns:
            UserInDB if found, None otherwise.
        """
        return _user_store.get(user_id)

    def is_token_blacklisted(self, token: str) -> bool:
        """
        Check if a token has been revoked (logged out).

        Args:
            token: The JWT token string.

        Returns:
            True if blacklisted, False otherwise.
        """
        return token in _token_blacklist

    # ── MongoDB Fallback Helpers (Day 5) ──────────────────

    async def _get_user_from_db_by_email(self, email: str) -> Optional[UserInDB]:
        """
        Look up a user by email in MongoDB and populate the in-memory cache.

        Args:
            email: The email to search for.

        Returns:
            UserInDB if found in MongoDB, None otherwise.
        """
        try:
            db = _get_db_service()
            if not db.is_connected:
                return None

            user_doc = await db.get_user_by_email(email)
            if user_doc:
                # Convert DB model to UserInDB and cache locally
                user = UserInDB(
                    user_id=user_doc.user_id,
                    email=user_doc.email,
                    name=user_doc.name,
                    role=user_doc.role.value,
                    hashed_password=user_doc.password_hash,
                    created_at=user_doc.created_at,
                )
                # Populate in-memory cache for subsequent lookups
                _user_store[user.user_id] = user
                _email_index[user.email] = user.user_id
                logger.debug("[AUTH] User loaded from MongoDB | email={}", email)
                return user
            return None
        except Exception as exc:
            logger.error("[AUTH] MongoDB email lookup failed | email={} | error={}", email, exc)
            return None

    async def _get_user_from_db_by_id(self, user_id: str) -> Optional[UserInDB]:
        """
        Look up a user by ID in MongoDB and populate the in-memory cache.

        Args:
            user_id: The user's unique identifier.

        Returns:
            UserInDB if found in MongoDB, None otherwise.
        """
        try:
            db = _get_db_service()
            if not db.is_connected:
                return None

            user_doc = await db.get_user_by_id(user_id)
            if user_doc:
                # Convert DB model to UserInDB and cache locally
                user = UserInDB(
                    user_id=user_doc.user_id,
                    email=user_doc.email,
                    name=user_doc.name,
                    role=user_doc.role.value,
                    hashed_password=user_doc.password_hash,
                    created_at=user_doc.created_at,
                )
                # Populate in-memory cache for subsequent lookups
                _user_store[user.user_id] = user
                _email_index[user.email] = user.user_id
                logger.debug("[AUTH] User loaded from MongoDB | user_id={}", user_id)
                return user
            return None
        except Exception as exc:
            logger.error("[AUTH] MongoDB id lookup failed | user_id={} | error={}", user_id, exc)
            return None


# ── Module-level service singleton ─────────────────────────
auth_service = AuthService()
