# """
# HiLearn AI Interview Prep - Authentication Service
# ====================================================
# Business logic for user signup, login, logout, and token refresh.

# Uses an in-memory store (dict) for development.
# TODO (MongoDB): Swap _user_store with Motor async MongoDB operations.
# """
# import re
# import uuid
# from datetime import datetime
# from typing import Dict, Optional, Set

# from loguru import logger

# from app.core.config import get_settings
# from app.core.security import (
#     create_access_token,
#     decode_access_token,
#     hash_password,
#     verify_password,
# )
# from app.models.schemas import (
#     AuthResponse,
#     LoginRequest,
#     SignupRequest,
#     TokenResponse,
#     UserInDB,
#     UserProfile,
# )

# settings = get_settings()

# # ─────────────────────────────────────────────────────────
# # In-Memory Stores (temporary until MongoDB is connected)
# # ─────────────────────────────────────────────────────────
# _user_store: Dict[str, UserInDB] = {}        # user_id -> UserInDB
# _email_index: Dict[str, str] = {}            # email -> user_id (fast lookup)
# _token_blacklist: Set[str] = set()           # revoked JWT tokens


# # ─────────────────────────────────────────────────────────
# # Email Validation Helper
# # ─────────────────────────────────────────────────────────
# _EMAIL_REGEX = re.compile(
#     r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
# )


# def _is_valid_email(email: str) -> bool:
#     """Validate email format using regex."""
#     return bool(_EMAIL_REGEX.match(email))


# # ─────────────────────────────────────────────────────────
# # Password Strength Validation
# # ─────────────────────────────────────────────────────────

# def _validate_password_strength(password: str) -> Optional[str]:
#     """
#     Validate password meets security requirements.

#     Returns:
#         None if valid, or an error message string if invalid.
#     """
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

#     Matches the singleton pattern used by InterviewService.
#     """

#     # ── Signup ────────────────────────────────────────────

#     async def signup(self, payload: SignupRequest) -> AuthResponse:
#         """
#         Register a new user.

#         Flow:
#             1. Validate email format
#             2. Check email uniqueness
#             3. Validate password strength
#             4. Hash password with bcrypt
#             5. Store user in memory
#             6. Generate JWT access token
#             7. Return AuthResponse

#         Args:
#             payload: SignupRequest with email, password, name, role.

#         Returns:
#             AuthResponse with user_id, token, role, message.

#         Raises:
#             HTTPException 400: Invalid email format or weak password.
#             HTTPException 409: Email already registered.
#         """
#         from fastapi import HTTPException, status

#         email = payload.email.lower().strip()
#         logger.info("[SIGNUP] Attempting registration | email={}", email)

#         # Validate email format
#         if not _is_valid_email(email):
#             logger.warning("[SIGNUP] Invalid email format | email={}", email)
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid email format. Please provide a valid email address.",
#             )

#         # Check email uniqueness
#         if email in _email_index:
#             logger.warning("[SIGNUP] Duplicate email | email={}", email)
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="An account with this email already exists. Please log in instead.",
#             )

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

#         # Create user record
#         user_id = str(uuid.uuid4())
#         user = UserInDB(
#             user_id=user_id,
#             email=email,
#             name=payload.name.strip(),
#             role=payload.role,
#             hashed_password=hashed,
#             created_at=datetime.utcnow(),
#         )

#         # Store in memory (TODO: MongoDB insert_one)
#         _user_store[user_id] = user
#         _email_index[email] = user_id

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
#             1. Find user by email
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
#         from fastapi import HTTPException, status

#         email = payload.email.lower().strip()
#         logger.info("[LOGIN] Attempting login | email={}", email)

#         # ── Admin login check (from .env credentials) ─────────
#         if email == settings.admin_email.lower().strip():
#             if payload.password != settings.admin_password:
#                 raise HTTPException(
#                     status_code=status.HTTP_401_UNAUTHORIZED,
#                     detail="Invalid admin credentials.",
#                     headers={"WWW-Authenticate": "Bearer"},
#                 )
#             token = create_access_token(
#                 data={"sub": "admin", "role": "admin", "email": email}
#             )
#             logger.success("[LOGIN] Admin login successful")
#             return AuthResponse(
#                 user_id="admin",
#                 token=token,
#                 role="admin",
#                 message="Welcome, Admin!",
#             )

#         # Find user by email
#         user = self.get_user_by_email(email)
#         if not user:
#             logger.warning("[LOGIN] User not found | email={}", email)
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid email or password.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         # Verify password
#         if not verify_password(payload.password, user.hashed_password):
#             logger.warning("[LOGIN] Wrong password | email={}", email)
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid email or password.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         logger.success(
#             "[LOGIN] Login successful | user_id={} | email={} | role={}",
#             user.user_id, email, user.role.value,
#         )

#         # Generate JWT
#         token = create_access_token(
#             data={"sub": user.user_id, "role": user.role.value, "email": email}
#         )

#         return AuthResponse(
#             user_id=user.user_id,
#             token=token,
#             role=user.role.value,
#             message=f"Welcome back, {user.name}!",
#         )

#     # ── Logout ────────────────────────────────────────────

#     async def logout(self, token: str) -> dict:
#         """
#         Invalidate a JWT token by adding it to the blacklist.

#         Args:
#             token: The JWT token string to revoke.

#         Returns:
#             Dict with success message.
#         """
#         _token_blacklist.add(token)
#         logger.info("[LOGOUT] Token blacklisted | token_prefix={}...", token[:20])
#         return {"message": "Logged out successfully. Token has been revoked."}

#     # ── Refresh Token ─────────────────────────────────────

#     async def refresh_token(self, token: str) -> TokenResponse:
#         """
#         Issue a new JWT token from a valid existing token.

#         Flow:
#             1. Decode the existing token
#             2. Ensure it's not blacklisted
#             3. Blacklist the old token
#             4. Issue a fresh token with the same claims

#         Args:
#             token: Current valid JWT token.

#         Returns:
#             TokenResponse with new access_token.

#         Raises:
#             HTTPException 401: If token is invalid, expired, or blacklisted.
#         """
#         from fastapi import HTTPException, status

#         # Check blacklist
#         if self.is_token_blacklisted(token):
#             logger.warning("[REFRESH] Attempted refresh with blacklisted token")
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Token has been revoked. Please log in again.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         # Decode (will raise 401 if invalid/expired)
#         payload = decode_access_token(token)
#         user_id = payload.get("sub")
#         role = payload.get("role")
#         email = payload.get("email")

#         if not user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid token: missing user identifier.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         # Blacklist old token
#         _token_blacklist.add(token)

#         # Issue new token
#         new_token = create_access_token(
#             data={"sub": user_id, "role": role, "email": email}
#         )

#         logger.success("[REFRESH] Token refreshed | user_id={}", user_id)
#         return TokenResponse(access_token=new_token)

#     # ── Get User Profile ──────────────────────────────────

#     async def get_profile(self, user_id: str) -> UserProfile:
#         """
#         Retrieve a user's public profile by their ID.

#         Args:
#             user_id: The user's unique identifier.

#         Returns:
#             UserProfile (email, name, role, created_at).

#         Raises:
#             HTTPException 401: If user not found.
#         """
#         from fastapi import HTTPException, status

#         user = self.get_user_by_id(user_id)
#         if not user:
#             logger.warning("[PROFILE] User not found | user_id={}", user_id)
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="User not found. Token may be stale.",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )

#         return UserProfile(
#             user_id=user.user_id,
#             email=user.email,
#             name=user.name,
#             role=user.role,
#             created_at=user.created_at,
#         )

#     # ── Lookup Helpers ────────────────────────────────────

#     def get_user_by_email(self, email: str) -> Optional[UserInDB]:
#         """
#         Find a user by their email address.

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
#         Find a user by their unique ID.

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

#         Returns:
#             True if blacklisted, False otherwise.
#         """
#         return token in _token_blacklist


# # ── Module-level service singleton ─────────────────────────
# auth_service = AuthService()

"""
HiLearn AI Interview Prep - Authentication Service
====================================================
Business logic for user signup, login, logout, and token refresh.

Uses MongoDB (Motor async) for persistent user storage.
Token blacklist is stored in a MongoDB collection so revoked tokens
survive server restarts.
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
# MongoDB Collections
# ─────────────────────────────────────────────────────────
_users_col = db["users"]               # { user_id, email, name, role, hashed_password, created_at }
_blacklist_col = db["token_blacklist"]  # { token, revoked_at }


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
    logout, and token management backed by MongoDB.
    """

    # ── Signup ────────────────────────────────────────────

    async def signup(self, payload: SignupRequest) -> AuthResponse:
        """
        Register a new user.

        Flow:
            1. Validate email format
            2. Check email uniqueness (MongoDB)
            3. Validate password strength
            4. Hash password with bcrypt
            5. Insert user document into MongoDB
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

        # Check email uniqueness in MongoDB
        existing = await _users_col.find_one({"email": email})
        if existing:
            logger.warning("[SIGNUP] Duplicate email | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists. Please log in instead.",
            )

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
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": payload.name.strip(),
            "role": payload.role.value,
            "hashed_password": hashed,
            "created_at": datetime.utcnow(),
        }

        # Persist to MongoDB
        await _users_col.insert_one(user_doc)
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
            1. Admin shortcut check (from .env credentials)
            2. Find user by email in MongoDB
            3. Verify password against bcrypt hash
            4. Generate JWT access token
            5. Return AuthResponse

        Raises:
            HTTPException 401: Invalid email or password.
        """
        email = payload.email.lower().strip()
        logger.info("[LOGIN] Attempting login | email={}", email)

        # ── Admin login check (plain text comparison with .env value) ──
        if email == settings.admin_email.lower().strip():
            if payload.password != settings.admin_password:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid admin credentials.",
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
                message="Welcome, Admin!",
            )

        # Find user by email in MongoDB
        user_doc = await _users_col.find_one({"email": email})
        if not user_doc:
            logger.warning("[LOGIN] User not found | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify password
        if not verify_password(payload.password, user_doc["hashed_password"]):
            logger.warning("[LOGIN] Wrong password | email={}", email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = user_doc["user_id"]
        role = user_doc["role"]
        name = user_doc["name"]

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

    # async def get_profile(self, user_id: str) -> UserProfile:
    #     """
    #     Retrieve a user's public profile by their ID.
    #     Handles the special 'admin' user_id that has no DB record.

    #     Raises:
    #         HTTPException 401: If user not found.
    #     """
    #     # FIX: admin has no DB record — return a synthetic profile
    #     if user_id == "admin":
    #         return UserProfile(
    #             user_id="admin",
    #             email=settings.admin_email,
    #             name="Admin",
    #             role=UserRole.ADMIN,
    #             created_at=datetime.utcnow(),
    #         )

    #     user_doc = await _users_col.find_one({"user_id": user_id})
    #     if not user_doc:
    #         logger.warning("[PROFILE] User not found | user_id={}", user_id)
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="User not found. Token may be stale.",
    #             headers={"WWW-Authenticate": "Bearer"},
    #         )

    #     return UserProfile(
    #         user_id=user_doc["user_id"],
    #         email=user_doc["email"],
    #         name=user_doc["name"],
    #         role=UserRole(user_doc["role"]),
    #         created_at=user_doc["created_at"],
    #     )

    from fastapi import HTTPException, status
from datetime import datetime

async def get_profile(self, user_id: str) -> UserProfile:
    """
    Retrieve a user's public profile by their ID.
    Handles the special 'admin' user_id that has no DB record.
    """

    # ✅ Admin case
    if user_id == "admin":
        return UserProfile(
            user_id="admin",
            email=settings.admin_email,
            name="Admin",
            role=UserRole.ADMIN,
            created_at=datetime.utcnow(),
        )

    # ✅ DB fetch (FIXED)
    user_doc = await _users_col.find_one({"_id": user_id})

    if not user_doc:
        logger.warning("[PROFILE] User not found | user_id={}", user_id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found. Token may be stale.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # ✅ Safe return
    return UserProfile(
        user_id=str(user_doc.get("_id")),
        email=user_doc.get("email", ""),
        name=user_doc.get("name", ""),
        role=UserRole(user_doc.get("role", "student")),
        created_at=user_doc.get("created_at", datetime.utcnow()),
    )

    # ── Token Blacklist Helpers ───────────────────────────

    async def is_token_blacklisted(self, token: str) -> bool:
        """
        Check if a token has been revoked via MongoDB lookup.

        Returns:
            True if blacklisted, False otherwise.
        """
        doc = await _blacklist_col.find_one({"token": token})
        return doc is not None


# ── Module-level service singleton ─────────────────────────
auth_service = AuthService()