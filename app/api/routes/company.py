"""
HiLearn AI Interview Prep — Company API Routes
=================================================
All endpoints for company registration, candidate discovery,
shortlisting, job postings, matching, and offer management.
"""
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from loguru import logger

from app.core.security import (
    create_access_token,
    hash_password,
    require_company,
    verify_password,
)
from app.models.db_models import (
    CandidateShortlistDocument,
    CompanyDocument,
    JobOfferDocument,
    JobPostingDocument,
)
from app.models.schemas import (
    CandidateProfileResponse,
    CandidateSearchResponse,
    CompanyAuthResponse,
    CompanyLoginRequest,
    CompanyProfileResponse,
    CompanyRegisterRequest,
    JobPostingRequest,
    JobPostingResponse,
    MatchedCandidateResponse,
    OfferRequest,
    OfferResponse,
    ShortlistRequest,
    ShortlistResponse,
)
from app.services.database import db_service

router = APIRouter(prefix="/company", tags=["Company"])


# ─────────────────────────────────────────────────────────
# Authentication
# ─────────────────────────────────────────────────────────

@router.post("/register", response_model=CompanyAuthResponse)
async def company_register(payload: CompanyRegisterRequest):
    """Register a new company account."""
    email = payload.email.lower().strip()
    logger.info("[COMPANY_REGISTER] Attempting | email={}", email)

    # Check if email already exists
    existing = await db_service.get_company_by_email(email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A company with this email already exists.",
        )

    # Hash password
    hashed = hash_password(payload.password)

    # Create company document
    company_doc = CompanyDocument(
        company_id=str(uuid.uuid4()),
        name=payload.company_name.strip(),
        email=email,
        password_hash=hashed,
        industry=payload.industry,
        size=payload.company_size,
        website=payload.website,
        description=payload.description,
    )

    result = await db_service.save_company(company_doc)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create company account.",
        )

    # Generate JWT with type: "company"
    token = create_access_token(
        data={
            "sub": company_doc.company_id,
            "type": "company",
            "email": email,
            "name": company_doc.name,
        }
    )

    logger.success("[COMPANY_REGISTER] Success | company_id={}", company_doc.company_id)
    return CompanyAuthResponse(
        company_id=company_doc.company_id,
        token=token,
        company_name=company_doc.name,
        message=f"Welcome to HiLearn, {company_doc.name}! Company account created.",
    )


@router.post("/login", response_model=CompanyAuthResponse)
async def company_login(payload: CompanyLoginRequest):
    """Authenticate a company account."""
    email = payload.email.lower().strip()
    logger.info("[COMPANY_LOGIN] Attempting | email={}", email)

    company = await db_service.get_company_by_email(email)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(payload.password, company.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(
        data={
            "sub": company.company_id,
            "type": "company",
            "email": company.email,
            "name": company.name,
        }
    )

    logger.success("[COMPANY_LOGIN] Success | company_id={}", company.company_id)
    return CompanyAuthResponse(
        company_id=company.company_id,
        token=token,
        company_name=company.name,
        message=f"Welcome back, {company.name}!",
    )


# ─────────────────────────────────────────────────────────
# Company Profile
# ─────────────────────────────────────────────────────────

@router.get("/me", response_model=CompanyProfileResponse)
async def get_company_profile(user: Dict[str, Any] = Depends(require_company)):
    """Get current company profile."""
    company_id = user.get("sub")
    company = await db_service.get_company_by_id(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    return CompanyProfileResponse(
        company_id=company.company_id,
        name=company.name,
        email=company.email,
        industry=company.industry,
        size=company.size,
        website=company.website,
        description=company.description,
        logo_url=company.logo_url,
        subscription_tier=company.subscription_tier,
        created_at=company.created_at,
    )


@router.put("/profile")
async def update_company_profile(
    updates: Dict[str, Any],
    user: Dict[str, Any] = Depends(require_company),
):
    """Update company profile fields."""
    company_id = user.get("sub")
    # Only allow safe fields to be updated
    allowed = {"name", "industry", "size", "website", "description", "logo_url"}
    safe_updates = {k: v for k, v in updates.items() if k in allowed}
    if not safe_updates:
        raise HTTPException(status_code=400, detail="No valid fields to update.")

    success = await db_service.update_company(company_id, safe_updates)
    return {"success": success, "message": "Profile updated." if success else "No changes made."}

# ─────────────────────────────────────────────────────────
# Company Settings
# ─────────────────────────────────────────────────────────

@router.get("/settings")
async def get_company_settings(user: Dict[str, Any] = Depends(require_company)):
    """Get company settings details."""
    company_id = user.get("sub")
    company = await db_service.get_company_by_id(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    return {
        "company_id": company.company_id,
        "name": company.name,
        "email": company.email,
        "industry": company.industry,
        "size": company.size,
        "website": company.website,
        "description": company.description,
        "created_at": str(company.created_at) if company.created_at else None,
    }


from app.models.schemas import UpdateCompanyProfileRequest

@router.patch("/settings/profile")
async def update_company_settings_profile(
    payload: UpdateCompanyProfileRequest,
    user: Dict[str, Any] = Depends(require_company),
):
    """Update company profile settings."""
    company_id = user.get("sub")
    
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update.")
        
    update_data["updated_at"] = datetime.utcnow()
    success = await db_service.update_company(company_id, update_data)
    
    return {"success": success, "message": "Profile updated successfully." if success else "Failed to update profile."}


from app.models.schemas import ChangePasswordRequest

@router.post("/settings/change-password")
async def change_company_password(
    payload: ChangePasswordRequest,
    user: Dict[str, Any] = Depends(require_company),
):
    """Change company password."""
    company_id = user.get("sub")
    company = await db_service.get_company_by_id(company_id)
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")
        
    if not verify_password(payload.current_password, company.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password.")
        
    hashed = hash_password(payload.new_password)
    success = await db_service.update_company(company_id, {"password_hash": hashed, "updated_at": datetime.utcnow()})
    
    return {"success": success, "message": "Password changed successfully." if success else "Failed to change password."}


# ─────────────────────────────────────────────────────────
# Candidate Discovery
# ─────────────────────────────────────────────────────────

@router.get("/candidates", response_model=List[CandidateSearchResponse])
async def search_candidates(
    role: Optional[str] = Query(None, description="Filter by target role"),
    min_score: float = Query(0, ge=0, le=100),
    max_score: float = Query(100, ge=0, le=100),
    skills: Optional[str] = Query(None, description="Comma-separated skills"),
    experience: Optional[str] = Query(None, description="junior, mid, senior"),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    user: Dict[str, Any] = Depends(require_company),
):
    """Search and filter candidates."""
    skills_list = [s.strip() for s in skills.split(",")] if skills else None
    candidates = await db_service.get_candidates_for_search(
        role=role,
        min_score=min_score,
        max_score=max_score,
        skills=skills_list,
        experience=experience,
        limit=limit,
        skip=skip,
    )
    return candidates


@router.get("/candidates/{user_id}", response_model=CandidateProfileResponse)
async def get_candidate_detail(
    user_id: str,
    user: Dict[str, Any] = Depends(require_company),
):
    """Get full candidate profile."""
    profile = await db_service.get_candidate_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return profile


# ─────────────────────────────────────────────────────────
# Shortlisting
# ─────────────────────────────────────────────────────────

@router.post("/shortlist/{user_id}")
async def shortlist_candidate(
    user_id: str,
    payload: ShortlistRequest,
    user: Dict[str, Any] = Depends(require_company),
):
    """Add a candidate to the company's shortlist."""
    company_id = user.get("sub")

    shortlist_doc = CandidateShortlistDocument(
        company_id=company_id,
        user_id=user_id,
        job_id=payload.job_id,
        notes=payload.notes,
    )
    result = await db_service.shortlist_candidate(shortlist_doc)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to shortlist candidate.")

    return {"success": True, "message": "Candidate shortlisted.", "shortlist_id": shortlist_doc.shortlist_id}


@router.get("/shortlisted", response_model=List[ShortlistResponse])
async def get_shortlisted(user: Dict[str, Any] = Depends(require_company)):
    """List all shortlisted candidates."""
    company_id = user.get("sub")
    return await db_service.get_shortlisted_candidates(company_id)


@router.delete("/shortlist/{user_id}")
async def remove_from_shortlist(
    user_id: str,
    user: Dict[str, Any] = Depends(require_company),
):
    """Remove a candidate from the shortlist."""
    company_id = user.get("sub")
    success = await db_service.remove_shortlist(company_id, user_id)
    return {"success": success, "message": "Removed from shortlist." if success else "Not found."}


@router.put("/shortlist/{user_id}")
async def update_shortlist_notes(
    user_id: str,
    payload: Dict[str, str],
    user: Dict[str, Any] = Depends(require_company),
):
    """Update notes on a shortlist entry."""
    company_id = user.get("sub")
    notes = payload.get("notes", "")
    success = await db_service.update_shortlist_notes(company_id, user_id, notes)
    return {"success": success}


# ─────────────────────────────────────────────────────────
# Job Postings
# ─────────────────────────────────────────────────────────

@router.post("/jobs", response_model=JobPostingResponse)
async def create_job(
    payload: JobPostingRequest,
    user: Dict[str, Any] = Depends(require_company),
):
    """Create a new job posting."""
    company_id = user.get("sub")

    deadline = None
    if payload.deadline:
        try:
            deadline = datetime.fromisoformat(payload.deadline)
        except ValueError:
            pass

    job_doc = JobPostingDocument(
        company_id=company_id,
        title=payload.job_title,
        description=payload.job_description,
        required_role=payload.required_role,
        required_score=payload.required_score,
        required_skills=payload.required_skills,
        experience_level=payload.experience_level,
        salary_range=payload.salary_range,
        location=payload.location,
        deadline=deadline,
    )

    result = await db_service.save_job(job_doc)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create job posting.")

    return JobPostingResponse(
        job_id=job_doc.job_id,
        company_id=company_id,
        title=job_doc.title,
        description=job_doc.description,
        required_role=job_doc.required_role,
        required_score=job_doc.required_score,
        required_skills=job_doc.required_skills,
        experience_level=job_doc.experience_level,
        salary_range=job_doc.salary_range,
        location=job_doc.location,
        deadline=payload.deadline,
        created_at=job_doc.created_at,
    )


@router.get("/jobs", response_model=List[JobPostingResponse])
async def list_jobs(user: Dict[str, Any] = Depends(require_company)):
    """List all job postings for the authenticated company."""
    company_id = user.get("sub")
    return await db_service.get_company_jobs(company_id)


@router.put("/jobs/{job_id}")
async def update_job(
    job_id: str,
    payload: Dict[str, Any],
    user: Dict[str, Any] = Depends(require_company),
):
    """Update a job posting."""
    allowed = {
        "title", "description", "required_role", "required_score",
        "required_skills", "experience_level", "salary_range",
        "location", "deadline", "status", "is_active",
    }
    safe_updates = {k: v for k, v in payload.items() if k in allowed}
    success = await db_service.update_job(job_id, safe_updates)
    return {"success": success}


@router.delete("/jobs/{job_id}")
async def delete_job(
    job_id: str,
    user: Dict[str, Any] = Depends(require_company),
):
    """Close/delete a job posting."""
    success = await db_service.delete_job(job_id)
    return {"success": success, "message": "Job posting closed." if success else "Job not found."}


# ─────────────────────────────────────────────────────────
# Candidate Matching
# ─────────────────────────────────────────────────────────

@router.get("/matched-candidates", response_model=List[MatchedCandidateResponse])
async def get_matched_candidates(
    job_id: str = Query(..., description="Job posting ID to match against"),
    user: Dict[str, Any] = Depends(require_company),
):
    """Auto-match candidates for a specific job posting."""
    return await db_service.get_matched_candidates(job_id)


# ─────────────────────────────────────────────────────────
# Job Offers
# ─────────────────────────────────────────────────────────

@router.post("/send-offer/{user_id}")
async def send_offer(
    user_id: str,
    payload: OfferRequest,
    user: Dict[str, Any] = Depends(require_company),
):
    """Send a job offer to a candidate."""
    company_id = user.get("sub")

    offer_doc = JobOfferDocument(
        company_id=company_id,
        user_id=user_id,
        job_id=payload.job_id,
        message=payload.message,
        call_link=payload.call_link,
    )

    result = await db_service.save_offer(offer_doc)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to send offer.")

    return {"success": True, "message": "Offer sent successfully.", "offer_id": offer_doc.offer_id}


@router.get("/candidate-responses", response_model=List[OfferResponse])
async def get_candidate_responses(user: Dict[str, Any] = Depends(require_company)):
    """Get all offer responses for the authenticated company."""
    company_id = user.get("sub")
    return await db_service.get_company_responses(company_id)


# ─────────────────────────────────────────────────────────
# Student Endpoints (Offer Management)
# ─────────────────────────────────────────────────────────
from app.core.security import require_student

@router.get("/my-offers", response_model=List[OfferResponse])
async def get_my_offers(user: Dict[str, Any] = Depends(require_student)):
    """Get all job offers for the authenticated student."""
    user_id = user.get("sub")
    return await db_service.get_candidate_offers(user_id)


@router.put("/my-offers/{offer_id}/respond")
async def respond_to_offer(
    offer_id: str,
    payload: Dict[str, str],
    user: Dict[str, Any] = Depends(require_student),
):
    """Respond to a job offer (accept/reject)."""
    user_id = user.get("sub")
    status = payload.get("status")
    response_message = payload.get("response_message", "")
    
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'accepted' or 'rejected'.")
        
    success = await db_service.update_offer_status(offer_id, user_id, status, response_message)
    if not success:
        raise HTTPException(status_code=404, detail="Offer not found or unauthorized.")
        
    return {"success": True, "message": f"Offer {status} successfully."}
