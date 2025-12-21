from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="GetMeOut API",
    description="Backend API for GetMeOut App - A discreet escape call service",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Twilio Client
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")

if not all([account_sid, auth_token, twilio_number]):
    raise ValueError("Missing required Twilio environment variables")

client = Client(account_sid, auth_token)

# Models
class EscapeCallRequest(BaseModel):
    to_number: str = "+916382230940"  # Default to user's number
    from_number: str = twilio_number  # Use Twilio number from environment
    message: str = "This is your escape call. You can leave now."

class CustomCallRequest(EscapeCallRequest):
    contact_name: Optional[str] = None

class CallResponse(BaseModel):
    success: bool
    call_sid: Optional[str] = None
    error: Optional[str] = None

# API Routes
@app.get("/")
async def root():
    return {"message": "Welcome to GetMeOut API"}

@app.post("/api/escape", response_model=CallResponse)
async def trigger_escape_call(request: EscapeCallRequest):
    """
    Trigger an escape call to the specified number
    """
    try:
        print(f"Incoming request: {request}")  # Debug log
        
        # Create TwiML for the call
        response = VoiceResponse()
        response.say(request.message)
        
        # Ensure we have valid numbers
        to_number = request.to_number or "+916382230940"  # Default to user's number
        from_number = twilio_number  # Always use the Twilio number from environment
        
        # Ensure proper formatting
        to_number = to_number.strip()
        if not to_number.startswith('+'):
            to_number = f"+{to_number}"
            
        print(f"Making call - To: {to_number}, From: {from_number}")  # Debug log
        
        # Make the call using Twilio
        call = client.calls.create(
            to=to_number,
            from_=from_number,
            twiml=str(response),
            record=True
        )
        
        print(f"Call initiated successfully. SID: {call.sid}")  # Debug log
        
        return {
            "success": True,
            "call_sid": call.sid
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger call: {str(e)}"
        )

@app.post("/api/custom-call", response_model=CallResponse)
async def trigger_custom_call(request: CustomCallRequest):
    """
    Trigger a custom call with the specified parameters
    """
    try:
        # Create a more personalized message for custom calls
        message = f"Hello, this is a call from {request.contact_name or 'a friend'}. {request.message}"
        
        # Create TwiML for the call
        response = VoiceResponse()
        response.say(message)
        
        # Make the call using Twilio
        call = client.calls.create(
            to=request.to_number,
            from_=request.from_number,
            twiml=str(response),
            record=True
        )
        
        return {
            "success": True,
            "call_sid": call.sid
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger custom call: {str(e)}"
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
