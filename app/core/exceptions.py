"""
HiLearn AI Interview Prep - Global Exception Handlers
Centralised error handling for clean, consistent API responses.
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from loguru import logger

from app.models.schemas import ErrorResponse


def register_exception_handlers(app: FastAPI) -> None:
    """Attach all global exception handlers to the FastAPI app."""

    # ── HTTP Exceptions (404, 401, 403, etc.) ────────────────────────────
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.warning(
            f"HTTPException | {request.method} {request.url.path} | "
            f"status={exc.status_code} | detail={exc.detail}"
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(
                error=_status_message(exc.status_code),
                detail=str(exc.detail),
                status_code=exc.status_code,
            ).model_dump(),
        )

    # ── Pydantic Validation Errors (422) ──────────────────────────────────
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        errors = exc.errors()
        logger.warning(
            f"ValidationError | {request.method} {request.url.path} | errors={errors}"
        )
        readable = "; ".join(
            f"{' → '.join(str(l) for l in e['loc'])}: {e['msg']}" for e in errors
        )
        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                error="Validation Error",
                detail=readable,
                status_code=422,
            ).model_dump(),
        )

    # ── Unhandled Exceptions (500) ────────────────────────────────────────
    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception(
            f"Unhandled Exception | {request.method} {request.url.path} | {exc}"
        )
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="Internal Server Error",
                detail="An unexpected error occurred. Our team has been notified.",
                status_code=500,
            ).model_dump(),
        )


def _status_message(code: int) -> str:
    messages = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        409: "Conflict",
        429: "Too Many Requests",
        500: "Internal Server Error",
        503: "Service Unavailable",
    }
    return messages.get(code, "Error")
