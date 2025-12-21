from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime, time
from uuid import uuid4
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

# Routine Models
class RoutineBase(BaseModel):
    name: str
    time: str
    days: List[str]
    enabled: bool = True
    to_number: str
    message: str = "This is your scheduled escape call."

class RoutineCreate(RoutineBase):
    pass

class Routine(RoutineBase):
    id: str

# In-memory storage for routines (in production, use a database)
routines_db: Dict[str, Routine] = {}

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

# Routine Endpoints
@app.get("/api/routines", response_model=List[Routine])
async def get_routines():
    """Get all routines"""
    return list(routines_db.values())

@app.post("/api/routines", response_model=Routine)
async def create_routine(routine: RoutineCreate):
    """Create a new routine"""
    routine_id = str(uuid4())
    routine_dict = routine.dict()
    routine_dict["id"] = routine_id
    routines_db[routine_id] = Routine(**routine_dict)
    return routines_db[routine_id]

@app.get("/api/routines/{routine_id}", response_model=Routine)
async def get_routine(routine_id: str):
    """Get a specific routine by ID"""
    if routine_id not in routines_db:
        raise HTTPException(status_code=404, detail="Routine not found")
    return routines_db[routine_id]

@app.put("/api/routines/{routine_id}", response_model=Routine)
async def update_routine(routine_id: str, routine: RoutineCreate):
    """Update a routine"""
    if routine_id not in routines_db:
        raise HTTPException(status_code=404, detail="Routine not found")
    routine_dict = routine.dict()
    routine_dict["id"] = routine_id
    routines_db[routine_id] = Routine(**routine_dict)
    return routines_db[routine_id]

@app.delete("/api/routines/{routine_id}")
async def delete_routine(routine_id: str):
    """Delete a routine"""
    if routine_id not in routines_db:
        raise HTTPException(status_code=404, detail="Routine not found")
    del routines_db[routine_id]
    return {"message": "Routine deleted successfully"}

@app.post("/api/routines/{routine_id}/trigger", response_model=CallResponse)
async def trigger_routine(routine_id: str):
    """Trigger a routine call immediately"""
    if routine_id not in routines_db:
        raise HTTPException(status_code=404, detail="Routine not found")
    
    routine = routines_db[routine_id]
    
    try:
        # Ensure proper phone number formatting
        to_number = routine.to_number.strip()
        if not to_number.startswith('+'):
            to_number = f"+{to_number}"
            
        # Create TwiML for the call
        response = VoiceResponse()
        response.say(routine.message)
        
        # Make the call using Twilio
        call = client.calls.create(
            to=to_number,
            from_=twilio_number,
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
            detail=f"Failed to trigger routine call: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
