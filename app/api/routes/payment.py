# """
# HiLearn - Razorpay Payment Integration
# =======================================
# Endpoints:
#   POST /api/v1/payment/create-order    → Razorpay order banao
#   POST /api/v1/payment/verify          → Payment verify karo aur subscription update karo
#   GET  /api/v1/payment/plans           → Plan details fetch karo
# """

# import hashlib
# import hmac
# import os
# from datetime import datetime

# import razorpay
# from fastapi import APIRouter, Depends, HTTPException, status
# from loguru import logger
# from pydantic import BaseModel

# from app.core.config import get_settings
# from app.core.security import get_current_user
# from app.services.database import DatabaseService

# router = APIRouter(prefix="/payment", tags=["Payment"])
# settings = get_settings()


# # ─── Razorpay client (lazy init) ─────────────────────────────────────────────
# def get_razorpay_client() -> razorpay.Client:
#     key_id = os.getenv("RAZORPAY_KEY_ID", "")
#     key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
#     if not key_id or not key_secret:
#         raise HTTPException(
#             status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
#             detail="Payment gateway not configured. Please contact support.",
#         )
#     return razorpay.Client(auth=(key_id, key_secret))


# # ─── Plans data ───────────────────────────────────────────────────────────────
# PLANS = {
#     "starter": {
#         "name": "Starter",
#         "price": 0,
#         "currency": "INR",
#         "description": "Practice the core flow with a limited round count.",
#         "perks": ["1 live interview flow", "Core feedback summary", "Basic history"],
#         "interviews_per_month": 1,
#     },
#     "pro": {
#         "name": "Pro",
#         "price": 29900,  # paise mein (₹299)
#         "currency": "INR",
#         "description": "Unlimited practice with the premium motion-rich experience.",
#         "perks": ["Unlimited interview flows", "Detailed feedback panels", "Dashboard insights"],
#         "interviews_per_month": -1,  # unlimited
#     },
#     "premium": {
#         "name": "Premium",
#         "price": 79900,  # paise mein (₹799)
#         "currency": "INR",
#         "description": "For candidates who want more structure and mentorship touchpoints.",
#         "perks": ["Everything in Pro", "Priority support", "Extended practice packs"],
#         "interviews_per_month": -1,
#     },
# }


# # ─── Schemas ─────────────────────────────────────────────────────────────────
# class CreateOrderRequest(BaseModel):
#     plan: str  # "pro" | "premium"


# class CreateOrderResponse(BaseModel):
#     order_id: str
#     amount: int
#     currency: str
#     key_id: str
#     plan: str
#     plan_name: str


# class VerifyPaymentRequest(BaseModel):
#     razorpay_order_id: str
#     razorpay_payment_id: str
#     razorpay_signature: str
#     plan: str


# class VerifyPaymentResponse(BaseModel):
#     success: bool
#     message: str
#     plan: str


# # ─── Routes ───────────────────────────────────────────────────────────────────
# @router.get("/plans")
# async def get_plans():
#     """Saare plans ki details return karo."""
#     return {"plans": PLANS}


# @router.post("/create-order", response_model=CreateOrderResponse)
# async def create_order(
#     body: CreateOrderRequest,
#     current_user: dict = Depends(get_current_user),
# ):
#     """
#     Razorpay order create karo.
#     Frontend pe Razorpay checkout open karne ke liye zaruri hai.
#     """
#     plan_key = body.plan.lower()

#     if plan_key not in PLANS:
#         raise HTTPException(status_code=400, detail=f"Invalid plan: {body.plan}")

#     if plan_key == "starter":
#         raise HTTPException(status_code=400, detail="Starter plan is free — no payment needed.")

#     plan = PLANS[plan_key]
#     client = get_razorpay_client()

#     try:
#         order_data = {
#             "amount": plan["price"],
#             "currency": plan["currency"],
#             "receipt": f"hilearn_{current_user['user_id']}_{plan_key}_{int(datetime.utcnow().timestamp())}",
#             "notes": {
#                 "user_id": current_user["user_id"],
#                 "user_email": current_user["email"],
#                 "plan": plan_key,
#             },
#         }
#         order = client.order.create(data=order_data)
#         logger.info(f"Razorpay order created: {order['id']} for user {current_user['user_id']}")

#         return CreateOrderResponse(
#             order_id=order["id"],
#             amount=plan["price"],
#             currency=plan["currency"],
#             key_id=os.getenv("RAZORPAY_KEY_ID", ""),
#             plan=plan_key,
#             plan_name=plan["name"],
#         )

#     except razorpay.errors.BadRequestError as e:
#         logger.error(f"Razorpay order error: {e}")
#         raise HTTPException(status_code=400, detail="Could not create payment order. Try again.")
#     except Exception as e:
#         logger.error(f"Unexpected payment error: {e}")
#         raise HTTPException(status_code=500, detail="Payment service error. Please try again.")


# @router.post("/verify", response_model=VerifyPaymentResponse)
# async def verify_payment(
#     body: VerifyPaymentRequest,
#     current_user: dict = Depends(get_current_user),
# ):
#     """
#     Razorpay signature verify karo aur user ka subscription update karo.
#     Yeh step server-side pe hona ZARURI hai — client pe nahi.
#     """
#     key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
#     if not key_secret:
#         raise HTTPException(status_code=503, detail="Payment gateway not configured.")

#     # ── Signature verify ───────────────────────────────────────────────────
#     generated_signature = hmac.new(
#         key_secret.encode("utf-8"),
#         f"{body.razorpay_order_id}|{body.razorpay_payment_id}".encode("utf-8"),
#         hashlib.sha256,
#     ).hexdigest()

#     if generated_signature != body.razorpay_signature:
#         logger.warning(
#             f"Payment signature mismatch for user {current_user['user_id']} "
#             f"order {body.razorpay_order_id}"
#         )
#         raise HTTPException(status_code=400, detail="Payment verification failed. Invalid signature.")

#     # ── Subscription update ────────────────────────────────────────────────
#     plan_key = body.plan.lower()
#     if plan_key not in PLANS:
#         raise HTTPException(status_code=400, detail="Invalid plan.")

#     try:
#         db = DatabaseService()
#         await db.update_user_subscription(
#             user_id=current_user["user_id"],
#             plan=plan_key,
#             payment_id=body.razorpay_payment_id,
#             order_id=body.razorpay_order_id,
#         )
#         logger.info(
#             f"✅ Subscription updated: user={current_user['user_id']} plan={plan_key} "
#             f"payment={body.razorpay_payment_id}"
#         )
#         return VerifyPaymentResponse(
#             success=True,
#             message=f"Payment successful! Welcome to {PLANS[plan_key]['name']} plan.",
#             plan=plan_key,
#         )

#     except Exception as e:
#         logger.error(f"Subscription update error: {e}")
#         # Payment ho gayi but DB fail — ye log karo for manual fix
#         raise HTTPException(
#             status_code=500,
#             detail=(
#                 "Payment received but subscription update failed. "
#                 f"Please contact support with payment ID: {body.razorpay_payment_id}"
#             ),
#         )


"""
HiLearn - Razorpay Payment Integration
=======================================
Endpoints:
  POST /api/v1/payment/create-order    → Razorpay order banao
  POST /api/v1/payment/verify          → Payment verify karo aur subscription update karo
  GET  /api/v1/payment/plans           → Plan details fetch karo
"""

import hashlib
import hmac
import os
from datetime import datetime

import razorpay
from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.security import get_current_user
from app.services.database import DatabaseService

router = APIRouter(prefix="/payment", tags=["Payment"])
settings = get_settings()


# ─── Razorpay client (lazy init) ─────────────────────────────────────────────
def get_razorpay_client() -> razorpay.Client:
    key_id = os.getenv("RAZORPAY_KEY_ID", "")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
    if not key_id or not key_secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment gateway not configured. Please contact support.",
        )
    return razorpay.Client(auth=(key_id, key_secret))


# ─── Plans data ───────────────────────────────────────────────────────────────
PLANS = {
    "starter": {
        "name": "Starter",
        "price": 0,
        "currency": "INR",
        "description": "Practice the core flow with a limited round count.",
        "perks": ["1 live interview flow", "Core feedback summary", "Basic history"],
        "interviews_per_month": 1,
    },
    "pro": {
        "name": "Pro",
        "price": 29900,  # paise mein (₹299)
        "currency": "INR",
        "description": "Unlimited practice with the premium motion-rich experience.",
        "perks": ["Unlimited interview flows", "Detailed feedback panels", "Dashboard insights"],
        "interviews_per_month": -1,  # unlimited
    },
    "premium": {
        "name": "Premium",
        "price": 79900,  # paise mein (₹799)
        "currency": "INR",
        "description": "For candidates who want more structure and mentorship touchpoints.",
        "perks": ["Everything in Pro", "Priority support", "Extended practice packs"],
        "interviews_per_month": -1,
    },
}


# ─── Schemas ─────────────────────────────────────────────────────────────────
class CreateOrderRequest(BaseModel):
    plan: str  # "pro" | "premium"


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str
    plan: str
    plan_name: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan: str


class VerifyPaymentResponse(BaseModel):
    success: bool
    message: str
    plan: str


# ─── Routes ───────────────────────────────────────────────────────────────────
@router.get("/plans")
async def get_plans():
    """Saare plans ki details return karo."""
    return {"plans": PLANS}


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(
    body: CreateOrderRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Razorpay order create karo.
    Frontend pe Razorpay checkout open karne ke liye zaruri hai.
    """
    plan_key = body.plan.lower()

    if plan_key not in PLANS:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {body.plan}")

    if plan_key == "starter":
        raise HTTPException(status_code=400, detail="Starter plan is free — no payment needed.")

    plan = PLANS[plan_key]
    client = get_razorpay_client()

    try:
        order_data = {
            "amount": plan["price"],
            "currency": plan["currency"],
            "receipt": f"hilearn_{current_user['sub']}_{plan_key}_{int(datetime.utcnow().timestamp())}",
            "notes": {
                "user_id": current_user["sub"],
                "user_email": current_user["email"],
                "plan": plan_key,
            },
        }
        order = client.order.create(data=order_data)
        logger.info(f"Razorpay order created: {order['id']} for user {current_user['sub']}")

        return CreateOrderResponse(
            order_id=order["id"],
            amount=plan["price"],
            currency=plan["currency"],
            key_id=os.getenv("RAZORPAY_KEY_ID", ""),
            plan=plan_key,
            plan_name=plan["name"],
        )

    except razorpay.errors.BadRequestError as e:
        logger.error(f"Razorpay order error: {e}")
        raise HTTPException(status_code=400, detail="Could not create payment order. Try again.")
    except Exception as e:
        logger.error(f"Unexpected payment error: {e}")
        raise HTTPException(status_code=500, detail="Payment service error. Please try again.")


@router.post("/verify", response_model=VerifyPaymentResponse)
async def verify_payment(
    body: VerifyPaymentRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Razorpay signature verify karo aur user ka subscription update karo.
    Yeh step server-side pe hona ZARURI hai — client pe nahi.
    """
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
    if not key_secret:
        raise HTTPException(status_code=503, detail="Payment gateway not configured.")

    # ── Signature verify ───────────────────────────────────────────────────
    generated_signature = hmac.new(
        key_secret.encode("utf-8"),
        f"{body.razorpay_order_id}|{body.razorpay_payment_id}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if generated_signature != body.razorpay_signature:
        logger.warning(
            f"Payment signature mismatch for user {current_user['sub']} "
            f"order {body.razorpay_order_id}"
        )
        raise HTTPException(status_code=400, detail="Payment verification failed. Invalid signature.")

    # ── Subscription update ────────────────────────────────────────────────
    plan_key = body.plan.lower()
    if plan_key not in PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan.")

    try:
        db = DatabaseService()
        await db.update_user_subscription(
            user_id=current_user["sub"],
            plan=plan_key,
            payment_id=body.razorpay_payment_id,
            order_id=body.razorpay_order_id,
        )
        logger.info(
            f"✅ Subscription updated: user={current_user['sub']} plan={plan_key} "
            f"payment={body.razorpay_payment_id}"
        )
        return VerifyPaymentResponse(
            success=True,
            message=f"Payment successful! Welcome to {PLANS[plan_key]['name']} plan.",
            plan=plan_key,
        )

    except Exception as e:
        logger.error(f"Subscription update error: {e}")
        # Payment ho gayi but DB fail — ye log karo for manual fix
        raise HTTPException(
            status_code=500,
            detail=(
                "Payment received but subscription update failed. "
                f"Please contact support with payment ID: {body.razorpay_payment_id}"
            ),
        )