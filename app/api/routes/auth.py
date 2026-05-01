"""
HiLearn AI Interview Prep - Authentication Routes
===================================================
POST /auth/signup          ->  Register a new user
POST /auth/login           ->  Authenticate and get JWT
POST /auth/logout          ->  Revoke current token
POST /auth/refresh-token   ->  Get a fresh JWT
GET  /auth/me              ->  Get current user profile (protected)
"""
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from loguru import logger

from app.core.security import get_current_user
from app.models.schemas import (
    APIResponse,
    AuthResponse,
    LoginRequest,
    SignupRequest,
    TokenRefreshRequest,
    TokenResponse,
    UserProfile,
)
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

_bearer_scheme = HTTPBearer(auto_error=False)


# ─────────────────────────────────────────────────────────
# POST /auth/signup
# ─────────────────────────────────────────────────────────
@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=201,
    summary="Register New User",
    description=(
        "Create a new HiLearn account. "
        "Returns a JWT token for immediate authentication. "
        "Email must be unique; password must contain uppercase, lowercase, "
        "digit, and special character (min 8 chars)."
    ),
    responses={
        201: {"description": "User registered successfully"},
        400: {"description": "Invalid email format or weak password"},
        409: {"description": "Email already registered"},
    },
)
async def signup(payload: SignupRequest) -> AuthResponse:
    """
    Register a new user account.

    **Flow:**
    1. Validate email format and uniqueness
    2. Enforce password strength rules
    3. Hash password with bcrypt (never stored in plain text)
    4. Create user record
    5. Generate JWT access token (24h expiry)
    6. Return user_id + token

    **Password Requirements:**
    - Minimum 8 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 digit
    - At least 1 special character
    """
    logger.info(
        "[AUTH-ROUTE] POST /auth/signup | email={} | name={}",
        payload.email, payload.name,
    )
    return await auth_service.signup(payload)


# ─────────────────────────────────────────────────────────
# POST /auth/login
# ─────────────────────────────────────────────────────────
@router.post(
    "/login",
    response_model=AuthResponse,
    summary="User Login",
    description=(
        "Authenticate with email and password. "
        "Returns a JWT access token valid for 24 hours."
    ),
    responses={
        200: {"description": "Login successful"},
        401: {"description": "Invalid email or password"},
    },
)
async def login(payload: LoginRequest) -> AuthResponse:
    """
    Authenticate an existing user.

    **Flow:**
    1. Look up user by email
    2. Verify password against bcrypt hash
    3. Generate JWT access token (24h expiry)
    4. Return user_id + token + role
    """
    logger.info("[AUTH-ROUTE] POST /auth/login | email={}", payload.email)
    return await auth_service.login(payload)


# ─────────────────────────────────────────────────────────
# POST /auth/logout
# ─────────────────────────────────────────────────────────
@router.post(
    "/logout",
    response_model=APIResponse,
    summary="User Logout",
    description=(
        "Invalidate the current JWT token. "
        "The token is added to a blacklist and can no longer be used."
    ),
    responses={
        200: {"description": "Token revoked successfully"},
        401: {"description": "Missing or invalid token"},
    },
)
async def logout(
    user: Dict[str, Any] = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
) -> APIResponse:
    """
    Logout the current user by blacklisting their JWT token.

    **Requires:** Valid Bearer token in Authorization header.
    """
    token = credentials.credentials
    logger.info(
        "[AUTH-ROUTE] POST /auth/logout | user_id={}",
        user.get("sub", "unknown"),
    )
    result = await auth_service.logout(token)
    return APIResponse(message=result["message"])


# ─────────────────────────────────────────────────────────
# POST /auth/refresh-token
# ─────────────────────────────────────────────────────────
@router.post(
    "/refresh-token",
    response_model=TokenResponse,
    summary="Refresh Access Token",
    description=(
        "Exchange a valid JWT token for a fresh one. "
        "The old token is blacklisted after exchange."
    ),
    responses={
        200: {"description": "New token issued"},
        401: {"description": "Invalid, expired, or blacklisted token"},
    },
)
async def refresh_token(
    user: Dict[str, Any] = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
) -> TokenResponse:
    """
    Refresh an access token.

    **Flow:**
    1. Validate the current token
    2. Blacklist the old token
    3. Issue a new token with same claims but fresh expiry
    """
    token = credentials.credentials
    logger.info("[AUTH-ROUTE] POST /auth/refresh-token | user_id={}", user.get("sub", "unknown"))
    return await auth_service.refresh_token(token)


# ─────────────────────────────────────────────────────────
# GET /auth/me
# ─────────────────────────────────────────────────────────
@router.get(
    "/me",
    response_model=UserProfile,
    summary="Get Current User",
    description=(
        "Retrieve the authenticated user's profile. "
        "Requires a valid Bearer token in the Authorization header."
    ),
    responses={
        200: {"description": "User profile retrieved"},
        401: {"description": "Missing, invalid, or expired token"},
    },
)
async def get_me(
    user: Dict[str, Any] = Depends(get_current_user),
) -> UserProfile:
    """
    Get the currently authenticated user's profile.

    **Requires:** Valid Bearer token in Authorization header.

    This endpoint is used by the frontend to:
    - Validate tokens on page load
    - Fetch user details for the dashboard
    - Check user role for access control
    """
    user_id = user.get("sub")
    logger.info("[AUTH-ROUTE] GET /auth/me | user_id={}", user_id)
    return await auth_service.get_profile(user_id)


# ─────────────────────────────────────────────────────────
# PUT /auth/profile
# ─────────────────────────────────────────────────────────
@router.put(
    "/profile",
    response_model=APIResponse,
    summary="Update User Profile",
    description="Update profile fields or change password.",
    responses={
        200: {"description": "Profile updated successfully"},
        400: {"description": "Invalid request"},
        401: {"description": "Missing or invalid token"},
    },
)
async def update_profile(
    payload: Dict[str, Any],
    user: Dict[str, Any] = Depends(get_current_user),
) -> APIResponse:
    from app.services.database import db_service
    from app.services.auth_service import _user_store
    from app.core.security import verify_password, hash_password

    user_id = user.get("sub")
    logger.info("[AUTH-ROUTE] PUT /auth/profile | user_id={}", user_id)

    # ── Password Change Request ────────────────────────────────────────────
    if "current_password" in payload or "new_password" in payload:
        current_pw = payload.get("current_password", "")
        new_pw = payload.get("new_password", "")

        if not current_pw or not new_pw:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both current_password and new_password are required.",
            )

        # Get user from cache or DB
        cached_user = _user_store.get(user_id)
        if not cached_user:
            from app.services.auth_service import auth_service
            cached_user = await auth_service._get_user_from_db_by_id(user_id)

        if not cached_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found.",
            )

        # Verify current password
        if not verify_password(current_pw, cached_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect.",
            )

        # Hash new password and save
        new_hashed = hash_password(new_pw)
        if db_service.is_connected:
            await db_service.update_user(user_id, {"password_hash": new_hashed})

        # Update in-memory cache
        if cached_user:
            cached_user.hashed_password = new_hashed

        return APIResponse(message="Password updated successfully.")

    # ── Profile Fields Update ──────────────────────────────────────────────
    allowed_fields = {"name", "phone", "location", "target_role", "bio", "experience_level"}
    update_data = {k: v for k, v in payload.items() if k in allowed_fields and v is not None}

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid fields to update.",
        )

    updated = False
    if db_service.is_connected:
        updated = await db_service.update_user(user_id, update_data)

    # Update in-memory cache
    cached_user = _user_store.get(user_id)
    if cached_user and "name" in update_data:
        cached_user.name = update_data["name"]

    return APIResponse(
        message="Profile updated successfully." if updated else "Profile saved (DB not connected).",
        data={"updated_fields": list(update_data.keys())},
    )