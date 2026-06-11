from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, Field, constr
from datetime import timedelta
import logging

from services.otp_service import OTPService
from core.security import create_access_token
from core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    # Enforce exactly 10 digits for mobile number
    mobile: str = Field(..., pattern=r"^\d{10}$", description="10-digit mobile number")

class VerifyRequest(BaseModel):
    mobile: str = Field(..., pattern=r"^\d{10}$")
    otp: str = Field(..., pattern=r"^\d{6}$", description="6-digit OTP code")

@router.post("/send-otp")
def send_otp(request: LoginRequest):
    try:
        # Pydantic already guarantees the format is correct by the time it reaches here
        OTPService.send_otp(request.mobile)
        return {"message": "OTP sent successfully"}
    except ValueError as e:
        # Catch specific service-level validation errors (e.g., rate limiting)
        logger.warning(f"OTP send failed for {request.mobile}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error sending OTP: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while sending OTP")

@router.post("/verify-otp")
def verify_otp(request: VerifyRequest, response: Response):
    try:
        role = OTPService.verify_otp(request.mobile, request.otp)
        if not role:
            raise HTTPException(status_code=401, detail="Invalid or expired OTP")
        
        # Create JWT
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"mobile": request.mobile, "role": role},
            expires_delta=access_token_expires
        )
        
        # Set HttpOnly cookie
        response.set_cookie(
            key="session",
            value=access_token,
            httponly=True,
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            samesite="lax",
            secure=False  # Set to True in production with HTTPS
        )
        
        return {"message": "Login successful", "role": role}
    except HTTPException:
        raise
    except ValueError as e:
        logger.warning(f"OTP verification failed for {request.mobile}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error verifying OTP: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while verifying OTP")

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("session")
    return {"message": "Logged out successfully"}
