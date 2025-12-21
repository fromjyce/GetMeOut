import os 
from twilio.rest import Client
from typing import Optional

class TwilioCallManager:
    def __init__(self, account_sid: Optional [str] = None, auth_token: Optional [str] = None): 
        self.account_sid = account_sid or os.getenv('TWILIO_ACCOUNT_SID', "ACe7873bdd729ec7850fedf67b074af71f") 
        self.auth_token = auth_token or os.getenv('TWILIO_AUTH_TOKEN', "caa1ca923f6fcc8daf3447d695fcb800")
        self.client = Client(self.account_sid, self.auth_token)

    def create_twiml_message(self, message: str, voice: str = "alice") -> str:
        return f'<Response><Say voice="{voice}">{message}</Say></Response>'

    def make_call(self, to_number: str, from_number: str, message: str, voice: str = "alice") -> Optional [str]:
        try:
            twiml = self.create_twiml_message(message, voice) 
            call = self.client.calls.create( to=to_number, from_ = from_number, twiml=twiml)
            return call.sid
        except Exception as e:
            print(f"Error making call: {e}")
            return None

def main():
        twilio_number = "+13853343642"
        my_phone_number = "+919025520072"
        message =  "Pankaj, This is your official escape call. Time to get out of that awkward situation. Act natural."
        call_manager = TwilioCallManager()
        call_sid  = call_manager.make_call(
            to_number=my_phone_number, 
            from_number=twilio_number, 
            message=message )
        if call_sid:
            print(f"Call initiated successfully. SID: {call_sid}")
        else:
            print("Failed to initiate call.")

main()
