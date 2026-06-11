import re

class OTPService:
    @staticmethod
    def send_otp(mobile: str) -> str:
        if not re.match(r"^\d{10}$", mobile):
            raise ValueError("Mobile number must be exactly 10 digits")
        
        # Placeholder for real SMS logic (e.g., Twilio, AWS SNS)
        # Here you could raise ValueError("Rate limit exceeded") if needed
        print(f"Mock sending OTP to {mobile}. In real app, this integrates with SMS provider.")
        return "Success"

    @staticmethod
    def verify_otp(mobile: str, otp: str) -> str | None:
        if not re.match(r"^\d{10}$", mobile) or not re.match(r"^\d{6}$", otp):
            raise ValueError("Invalid mobile or OTP format")
            
        # Mock verification logic (In production, verify against Redis/DB)
        if otp == "123456":
            return "user"
        elif otp == "654321":
            return "admin"
        return None
