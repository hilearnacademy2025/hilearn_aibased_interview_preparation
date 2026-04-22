

# """
# HiLearn AI Interview Prep - Authentication Service
# ====================================================
# Business logic for user signup, login, logout, and token refresh.

# Day 4: JWT-based auth with bcrypt password hashing.                 ✅
# Day 5: MongoDB persistence via DatabaseService — in-memory cache
#        retained for fast reads, DB used for persistence.            ✅

# Uses in-memory stores as cache; MongoDB is the source of truth
# when available. Graceful fallback when MongoDB is unavailable.
# """
# import re
# import uuid
# from datetime import datetime
# from typing import Optional

# from fastapi import HTTPException, status
# from loguru import logger

# from app.core.config import get_settings
# from app.core.security import (
#     create_access_token,
#     decode_access_token,
#     hash_password,
#     verify_password,
# )
# from app.db.database import db
# from app.models.schemas import (
#     AuthResponse,
#     LoginRequest,
#     SignupRequest,
#     TokenResponse,
#     UserProfile,
#     UserRole,
# )

# settings = get_settings()

# # ─────────────────────────────────────────────────────────
# # In-Memory Caches (fast reads; DB for persistence)
# # ─────────────────────────────────────────────────────────
# _users_col = db["users"]               # { user_id, email, name, role, hashed_password, created_at }
# _blacklist_col = db["token_blacklist"]  # { token, revoked_at }


# # ─────────────────────────────────────────────────────────
# # DB Service Lazy Import (avoids circular imports)
# # ─────────────────────────────────────────────────────────
# def _get_db_service():
#     """
#     Lazy import to avoid circular imports at module load time.

#     Returns:
#         The singleton DatabaseService instance.
#     """
#     from app.services.database import db_service
#     return db_service


# # ─────────────────────────────────────────────────────────
# # Email Validation Helper
# # ─────────────────────────────────────────────────────────
# _EMAIL_REGEX = re.compile(
#     r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
# )


# def _is_valid_email(email: str) -> bool:
#     return bool(_EMAIL_REGEX.match(email))


# # ─────────────────────────────────────────────────────────
# # Password Strength Validation
# # ─────────────────────────────────────────────────────────

# def _validate_password_strength(password: str) -> Optional[str]:
#     if len(password) < 8:
#         return "Password must be at least 8 characters long."
#     if not re.search(r"[A-Z]", password):
#         return "Password must contain at least one uppercase letter."
#     if not re.search(r"[a-z]", password):
#         return "Password must contain at least one lowercase letter."
#     if not re.search(r"\d", password):
#         return "Password must contain at least one digit."
#     if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
#         return "Password must contain at least one special character (!@#$%^&* etc.)."
#     return None


# # ─────────────────────────────────────────────────────────
# # Auth Service Class
# # ─────────────────────────────────────────────────────────

# class AuthService:
#     """
#     Authentication service handling user registration, login,
#     logout, and token management.

#     Day 5: All mutations are persisted to MongoDB via DatabaseService.
#     In-memory stores are kept as a cache for fast lookups.
#     Matches the singleton pattern used by InterviewService.
#     """

#     # ── Signup ────────────────────────────────────────────

#     async def signup(self, payload: SignupRequest) -> AuthResponse:
#         """
#         Register a new user.

#         Flow:
#             1. Validate email format
#             2. Check email uniqueness (in-memory + MongoDB)
#             3. Validate password strength
#             4. Hash password with bcrypt
#             5. Store user in-memory + MongoDB
#             6. Generate JWT access token
#             7. Return AuthResponse

#         Raises:
#             HTTPException 400: Invalid email or weak password.
#             HTTPException 409: Email already registered.
#         """
#         email = payload.email.lower().strip()
#         logger.info("[SIGNUP] Attempting registration | email={}", email)

#         # Validate email format
#         if not _is_valid_email(email):
#             logger.warning("[SIGNUP] Invalid email format | email={}", email)
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid email format. Please provide a valid email address.",
#             )

#         # Check email uniqueness — in-memory first, then MongoDB
#         if email in _email_index:
#             logger.warning("[SIGNUP] Duplicate email (in-memory) | email={}", email)
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="An account with this email already exists. Please log in instead.",
#             )

#         # Day 5: Also check MongoDB for existing email
#         try:
#             db = _get_db_service()
#             if db.is_connected:
#                 existing = await db.get_user_by_email(email)
#                 if existing:
#                     logger.warning("[SIGNUP] Duplicate email (MongoDB) | email={}", email)
#                     raise HTTPException(
#                         status_code=status.HTTP_409_CONFLICT,
#                         detail="An account with this email already exists. Please log in instead.",
#                     )
#         except HTTPException:
#             raise  # re-raise HTTP exceptions
#         except Exception as exc:
#             logger.warning("[SIGNUP] MongoDB email check failed | error={} | continuing", exc)

#         # Validate password strength
#         password_error = _validate_password_strength(payload.password)
#         if password_error:
#             logger.warning("[SIGNUP] Weak password | email={} | reason={}", email, password_error)
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=password_error,
#             )

#         # Hash password — NEVER store plain text
#         hashed = hash_password(payload.password)

#         # Build user document
#         user_id = str(uuid.uuid4())
#         user = UserInDB(
#             user_id=user_id,
#             email=email,
#             name=payload.name.strip(),
#             role=payload.role,
#             hashed_password=hashed,
#             created_at=datetime.utcnow(),
#         )

#         # Store in-memory cache
#         _user_store[user_id] = user
#         _email_index[email] = user_id

#         # ── Day 5: Persist to MongoDB (non-blocking) ─────────────────────
#         try:
#             db = _get_db_service()
#             if db.is_connected:
#                 from app.models.db_models import UserDocument
#                 user_doc = UserDocument(
#                     user_id=user_id,
#                     email=email,
#                     password_hash=hashed,
#                     name=payload.name.strip(),
#                     role=payload.role.value,
#                     created_at=user.created_at,
#                 )
#                 await db.create_user(user_doc)
#                 logger.info("[SIGNUP] User persisted to MongoDB | user_id={}", user_id)
#         except Exception as exc:
#             logger.warning("[SIGNUP] MongoDB persist failed | error={} | user still in-memory", exc)

#         logger.success(
#             "[SIGNUP] User registered | user_id={} | email={} | role={}",
#             user_id, email, payload.role.value,
#         )

#         # Generate JWT
#         token = create_access_token(
#             data={"sub": user_id, "role": payload.role.value, "email": email}
#         )

#         return AuthResponse(
#             user_id=user_id,
#             token=token,
#             role=payload.role.value,
#             message=f"Welcome to HiLearn, {payload.name.strip()}! Account created successfully.",
#         )

#     # ── Login ─────────────────────────────────────────────

#     async def login(self, payload: LoginRequest) -> AuthResponse:
#         """
#         Authenticate an existing user.

#         Flow:
#             1. Find user by email (in-memory cache → MongoDB fallback)
#             2. Verify password against bcrypt hash
#             3. Generate JWT access token
#             4. Return AuthResponse

#         Args:
#             payload: LoginRequest with email, password.

#         Returns:
#             AuthResponse with user_id, token, role, message.

#         Raises:
#             HTTPException 401: Invalid email or password.
#         """
#         email = payload.email.lower().strip()
#         logger.info("[LOGIN] Attempting login | email={}", email)

#         # Find user by email — try in-memory first, then MongoDB
#         user = self.get_user_by_email(email)

#         # Day 5: If not in cache, try MongoDB
#         if not user:
#             user = await self._get_user_from_db_by_email(email)

#         if not user:
#             logger.warning("[LOGIN] User not found | email={}", email)
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid email or password.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         # Verify password
#         if not verify_password(payload.password, user_doc["hashed_password"]):
#             logger.warning("[LOGIN] Wrong password | email={}", email)
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid email or password.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         user_id = user_doc["user_id"]
#         role = user_doc["role"]
#         name = user_doc["name"]

#         logger.success(
#             "[LOGIN] Login successful | user_id={} | email={} | role={}",
#             user_id, email, role,
#         )

#         # Generate JWT
#         token = create_access_token(
#             data={"sub": user_id, "role": role, "email": email}
#         )

#         return AuthResponse(
#             user_id=user_id,
#             token=token,
#             role=role,
#             message=f"Welcome back, {name}!",
#         )

#     # ── Logout ────────────────────────────────────────────

#     async def logout(self, token: str) -> dict:
#         """
#         Invalidate a JWT token by inserting it into the MongoDB blacklist.
#         Survives server restarts unlike the old in-memory set.
#         """
#         await _blacklist_col.update_one(
#             {"token": token},
#             {"$setOnInsert": {"token": token, "revoked_at": datetime.utcnow()}},
#             upsert=True,
#         )
#         logger.info("[LOGOUT] Token blacklisted | token_prefix={}...", token[:20])
#         return {"message": "Logged out successfully. Token has been revoked."}

#     # ── Refresh Token ─────────────────────────────────────

#     async def refresh_token(self, token: str) -> TokenResponse:
#         """
#         Issue a new JWT token from a valid existing token.

#         Flow:
#             1. Ensure it's not blacklisted (MongoDB)
#             2. Decode the existing token
#             3. Blacklist the old token
#             4. Issue a fresh token with the same claims

#         Raises:
#             HTTPException 401: If token is invalid, expired, or blacklisted.
#         """
#         # Check blacklist first
#         if await self.is_token_blacklisted(token):
#             logger.warning("[REFRESH] Attempted refresh with blacklisted token")
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Token has been revoked. Please log in again.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         # Decode (will raise 401 if invalid/expired)
#         token_payload = decode_access_token(token)
#         user_id = token_payload.get("sub")
#         role = token_payload.get("role")
#         email = token_payload.get("email")

#         if not user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid token: missing user identifier.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         # Blacklist old token in MongoDB
#         await _blacklist_col.update_one(
#             {"token": token},
#             {"$setOnInsert": {"token": token, "revoked_at": datetime.utcnow()}},
#             upsert=True,
#         )

#         # Issue new token
#         new_token = create_access_token(
#             data={"sub": user_id, "role": role, "email": email}
#         )

#         logger.success("[REFRESH] Token refreshed | user_id={}", user_id)
#         return TokenResponse(access_token=new_token)

#     # ── Get User Profile ──────────────────────────────────

#     # async def get_profile(self, user_id: str) -> UserProfile:
#     #     """
#     #     Retrieve a user's public profile by their ID.
#     #     Handles the special 'admin' user_id that has no DB record.

#         Checks in-memory cache first, then falls back to MongoDB.

#         Args:
#             user_id: The user's unique identifier.

#     #     user_doc = await _users_col.find_one({"user_id": user_id})
#     #     if not user_doc:
#     #         logger.warning("[PROFILE] User not found | user_id={}", user_id)
#     #         raise HTTPException(
#     #             status_code=status.HTTP_401_UNAUTHORIZED,
#     #             detail="User not found. Token may be stale.",
#     #             headers={"WWW-Authenticate": "Bearer"},
#     #         )

#     #     return UserProfile(
#     #         user_id=user_doc["user_id"],
#     #         email=user_doc["email"],
#     #         name=user_doc["name"],
#     #         role=UserRole(user_doc["role"]),
#     #         created_at=user_doc["created_at"],
#     #     )


#     from fastapi import HTTPException, status
#     from datetime import datetime

#     user = self.get_user_by_id(user_id)

# # Try DB if not found in memory
#     if not user:
#     user = await self._get_user_from_db_by_id(user_id)

# # Still not found → error
#     if not user:
#     logger.warning("[PROFILE] User not found | user_id={}", user_id)
#     raise HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="User not found. Token may be stale.",
#         headers={"WWW-Authenticate": "Bearer"},
#     )


# async def get_profile(self, user_id: str) -> UserProfile:
#     """
#     Retrieve a user's public profile by their ID.
#     Handles the special 'admin' user_id that has no DB record.
#     """

#     # ✅ Admin case
#     if user_id == "admin":
#         return UserProfile(
#             user_id="admin",
#             email=settings.admin_email,
#             name="Admin",
#             role=UserRole.ADMIN,
#             created_at=datetime.utcnow(),
#         )

#     # ── Lookup Helpers (in-memory cache) ──────────────────

#     if not user_doc:
#         logger.warning("[PROFILE] User not found | user_id={}", user_id)
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="User not found. Token may be stale.",
#             headers={"WWW-Authenticate": "Bearer"},
#         )

#     # ✅ Safe return
#     return UserProfile(
#         user_id=str(user_doc.get("_id")),
#         email=user_doc.get("email", ""),
#         name=user_doc.get("name", ""),
#         role=UserRole(user_doc.get("role", "student")),
#         created_at=user_doc.get("created_at", datetime.utcnow()),
#     )

#     # ── Token Blacklist Helpers ───────────────────────────

#     async def is_token_blacklisted(self, token: str) -> bool:
#         """
# <<<<<<< HEAD
#         Check if a token has been revoked via MongoDB lookup.
# =======
#         Find a user by their email address in the in-memory cache.

#         Args:
#             email: The email to search for.

#         Returns:
#             UserInDB if found, None otherwise.
#         """
#         user_id = _email_index.get(email.lower().strip())
#         if user_id:
#             return _user_store.get(user_id)
#         return None

#     def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
#         """
#         Find a user by their unique ID in the in-memory cache.

#         Args:
#             user_id: The user_id to search for.

#         Returns:
#             UserInDB if found, None otherwise.
#         """
#         return _user_store.get(user_id)

#     def is_token_blacklisted(self, token: str) -> bool:
#         """
#         Check if a token has been revoked (logged out).

#         Args:
#             token: The JWT token string.
# >>>>>>> origin/rahil

#         Returns:
#             True if blacklisted, False otherwise.
#         """
#         doc = await _blacklist_col.find_one({"token": token})
#         return doc is not None

#     # ── MongoDB Fallback Helpers (Day 5) ──────────────────

#     async def _get_user_from_db_by_email(self, email: str) -> Optional[UserInDB]:
#         """
#         Look up a user by email in MongoDB and populate the in-memory cache.

#         Args:
#             email: The email to search for.

#         Returns:
#             UserInDB if found in MongoDB, None otherwise.
#         """
#         try:
#             db = _get_db_service()
#             if not db.is_connected:
#                 return None

#             user_doc = await db.get_user_by_email(email)
#             if user_doc:
#                 # Convert DB model to UserInDB and cache locally
#                 user = UserInDB(
#                     user_id=user_doc.user_id,
#                     email=user_doc.email,
#                     name=user_doc.name,
#                     role=user_doc.role.value,
#                     hashed_password=user_doc.password_hash,
#                     created_at=user_doc.created_at,
#                 )
#                 # Populate in-memory cache for subsequent lookups
#                 _user_store[user.user_id] = user
#                 _email_index[user.email] = user.user_id
#                 logger.debug("[AUTH] User loaded from MongoDB | email={}", email)
#                 return user
#             return None
#         except Exception as exc:
#             logger.error("[AUTH] MongoDB email lookup failed | email={} | error={}", email, exc)
#             return None

#     async def _get_user_from_db_by_id(self, user_id: str) -> Optional[UserInDB]:
#         """
#         Look up a user by ID in MongoDB and populate the in-memory cache.

#         Args:
#             user_id: The user's unique identifier.

#         Returns:
#             UserInDB if found in MongoDB, None otherwise.
#         """
#         try:
#             db = _get_db_service()
#             if not db.is_connected:
#                 return None

#             user_doc = await db.get_user_by_id(user_id)
#             if user_doc:
#                 # Convert DB model to UserInDB and cache locally
#                 user = UserInDB(
#                     user_id=user_doc.user_id,
#                     email=user_doc.email,
#                     name=user_doc.name,
#                     role=user_doc.role.value,
#                     hashed_password=user_doc.password_hash,
#                     created_at=user_doc.created_at,
#                 )
#                 # Populate in-memory cache for subsequent lookups
#                 _user_store[user.user_id] = user
#                 _email_index[user.email] = user.user_id
#                 logger.debug("[AUTH] User loaded from MongoDB | user_id={}", user_id)
#                 return user
#             return None
#         except Exception as exc:
#             logger.error("[AUTH] MongoDB id lookup failed | user_id={} | error={}", user_id, exc)
#             return None


# # ── Module-level service singleton ─────────────────────────
# auth_service = AuthService()



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
from typing import Optional

from fastapi import HTTPException, status
from loguru import logger

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.db.database import db
from app.models.schemas import (
    AuthResponse,
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserProfile,
    UserRole,
)

settings = get_settings()

# ─────────────────────────────────────────────────────────
# In-Memory Caches (fast reads; DB for persistence)
# ─────────────────────────────────────────────────────────
_users_col = db["users"]               # MongoDB collection
_blacklist_col = db["token_blacklist"]  # MongoDB collection

# FIX 1: These were missing — in-memory cache dicts
_user_store: dict = {}    # { user_id -> UserInDB }
_email_index: dict = {}   # { email   -> user_id  }


# ─────────────────────────────────────────────────────────
# UserInDB — lightweight in-memory user model
# ─────────────────────────────────────────────────────────
# FIX 2: UserInDB was never defined/imported — adding it here
class UserInDB:
    def __init__(self, user_id, email, name, role, hashed_password, created_at):
        self.user_id = user_id
        self.email = email
        self.name = name
        self.role = role
        self.hashed_password = hashed_password
        self.created_at = created_at


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
    return bool(_EMAIL_REGEX.match(email))


# ─────────────────────────────────────────────────────────
# Password Strength Validation
# ─────────────────────────────────────────────────────────

def _validate_password_strength(password: str) -> Optional[str]:
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

        Raises:
            HTTPException 400: Invalid email or weak password.
            HTTPException 409: Email already registered.
        """
        email = payload.email.lower().strip()
        logger.info("[SIGNUP] Attempting registration | email={}", email)

        # Validate email format
        if not _is_valid_email(email):
            logger.warning("[SIGNUP] Invalid email format | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format. Please provide a valid email address.",
            )

        # Check email uniqueness — in-memory first
        if email in _email_index:
            logger.warning("[SIGNUP] Duplicate email (in-memory) | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists. Please log in instead.",
            )

        # Also check MongoDB for existing email
        try:
            db_svc = _get_db_service()
            if db_svc.is_connected:
                existing = await db_svc.get_user_by_email(email)
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

        # Build user document
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

        # Persist to MongoDB (non-blocking on failure)
        try:
            db_svc = _get_db_service()
            if db_svc.is_connected:
                from app.models.db_models import UserDocument
                user_doc = UserDocument(
                    user_id=user_id,
                    email=email,
                    password_hash=hashed,
                    name=payload.name.strip(),
                    role=payload.role.value,
                    created_at=user.created_at,
                )
                await db_svc.create_user(user_doc)
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

        Raises:
            HTTPException 401: Invalid email or password.
        """
        email = payload.email.lower().strip()
        # ── Admin special case ─────────────────────────────────────────────────
        if email == settings.admin_email.lower().strip():
            if payload.password != settings.admin_password:
                logger.warning("[LOGIN] Wrong admin password | email={}", email)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password.",
                    headers={"WWW-Authenticate": "Bearer"},
              )
            token = create_access_token(
                data={"sub": "admin", "role": "admin", "email": email}
            )
            logger.success("[LOGIN] Admin login successful")
            return AuthResponse(
                user_id="admin",
                token=token,
                role="admin",
                message="Welcome back, Admin!",
           )
        logger.info("[LOGIN] Attempting login | email={}", email)

        # FIX 3: Was finding `user` but then using `user_doc[...]` — consistent now
        user = self.get_user_by_email(email)

        # If not in cache, try MongoDB
        if not user:
            user = await self._get_user_from_db_by_email(email)

        if not user:
            logger.warning("[LOGIN] User not found | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify password — use `user` object attributes consistently
        if not verify_password(payload.password, user.hashed_password):
            logger.warning("[LOGIN] Wrong password | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = user.user_id
        role = user.role if isinstance(user.role, str) else user.role.value
        name = user.name

        logger.success(
            "[LOGIN] Login successful | user_id={} | email={} | role={}",
            user_id, email, role,
        )

        # Generate JWT
        token = create_access_token(
            data={"sub": user_id, "role": role, "email": email}
        )

        return AuthResponse(
            user_id=user_id,
            token=token,
            role=role,
            message=f"Welcome back, {name}!",
        )

    # ── Logout ────────────────────────────────────────────

    async def logout(self, token: str) -> dict:
        """
        Invalidate a JWT token by inserting it into the MongoDB blacklist.
        Survives server restarts unlike the old in-memory set.
        """
        await _blacklist_col.update_one(
            {"token": token},
            {"$setOnInsert": {"token": token, "revoked_at": datetime.utcnow()}},
            upsert=True,
        )
        logger.info("[LOGOUT] Token blacklisted | token_prefix={}...", token[:20])
        return {"message": "Logged out successfully. Token has been revoked."}

    # ── Refresh Token ─────────────────────────────────────

    async def refresh_token(self, token: str) -> TokenResponse:
        """
        Issue a new JWT token from a valid existing token.

        Flow:
            1. Ensure it's not blacklisted (MongoDB)
            2. Decode the existing token
            3. Blacklist the old token
            4. Issue a fresh token with the same claims

        Raises:
            HTTPException 401: If token is invalid, expired, or blacklisted.
        """
        # Check blacklist first
        if await self.is_token_blacklisted(token):
            logger.warning("[REFRESH] Attempted refresh with blacklisted token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked. Please log in again.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Decode (will raise 401 if invalid/expired)
        token_payload = decode_access_token(token)
        user_id = token_payload.get("sub")
        role = token_payload.get("role")
        email = token_payload.get("email")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user identifier.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Blacklist old token in MongoDB
        await _blacklist_col.update_one(
            {"token": token},
            {"$setOnInsert": {"token": token, "revoked_at": datetime.utcnow()}},
            upsert=True,
        )

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
        Handles the special 'admin' user_id that has no DB record.

        Checks in-memory cache first, then falls back to MongoDB.

        Args:
            user_id: The user's unique identifier.

        Returns:
            UserProfile with public fields.

        Raises:
            HTTPException 401: If user not found.
        """
        # FIX 4: This entire method was broken — commented-out code mixed with
        # live code, wrong indentation, method body spilling outside class.
        # Rewritten cleanly below.

        # Admin special case — no DB record exists
        if user_id == "admin":
            return UserProfile(
                user_id="admin",
                email=settings.admin_email,
                name="Admin",
                role=UserRole.ADMIN,
                created_at=datetime.utcnow(),
            )

        # Try in-memory cache first
        user = self.get_user_by_id(user_id)

        # Fallback to MongoDB if not cached
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
            role=UserRole(user.role) if isinstance(user.role, str) else user.role,
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

    # ── Token Blacklist Helpers ───────────────────────────

    # FIX 5: Merge conflict removed — keeping the async MongoDB version (Day 5)
    async def is_token_blacklisted(self, token: str) -> bool:
        """
        Check if a token has been revoked via MongoDB lookup.

        Args:
            token: The JWT token string.

        Returns:
            True if blacklisted, False otherwise.
        """
        doc = await _blacklist_col.find_one({"token": token})
        return doc is not None

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
            db_svc = _get_db_service()
            if not db_svc.is_connected:
                return None

            user_doc = await db_svc.get_user_by_email(email)
            if user_doc:
                user = UserInDB(
                    user_id=user_doc.user_id,
                    email=user_doc.email,
                    name=user_doc.name,
                    role=user_doc.role.value,
                    hashed_password=user_doc.password_hash,
                    created_at=user_doc.created_at,
                )
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
            db_svc = _get_db_service()
            if not db_svc.is_connected:
                return None

            user_doc = await db_svc.get_user_by_id(user_id)
            if user_doc:
                user = UserInDB(
                    user_id=user_doc.user_id,
                    email=user_doc.email,
                    name=user_doc.name,
                    role=user_doc.role.value,
                    hashed_password=user_doc.password_hash,
                    created_at=user_doc.created_at,
                )
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