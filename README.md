# 🚪 GetMeOut - Your Discreet Escape Assistant

GetMeOut is a smart mobile app designed to help you escape awkward or uncomfortable situations discreetly. It triggers real incoming phone calls using Twilio, complete with customizable caller names and prerecorded messages. Whether you need a quick getaway or want to schedule routine calls, GetMeOut has you covered.

---

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Components & Modules](#components--modules)
- [Configuration](#configuration)
- [Development & Contributing](#development--contributing)

---

## ✨ Features

### 🔴 **Quick Escape Button**
- One-tap instant escape call to your phone
- Uses pre-configured caller name and message
- Instant triggering without any setup

### 🟡 **Custom Call Setup**
- Configure caller name (e.g., "Mom", "Boss", "HR")
- Set custom callback number
- Record personalized escape message
- Trigger with custom parameters

### 🔵 **Smart Routines** (Alexa-style Scheduling)
- **Daily Routines**: Set calls for specific times every day
- **Weekly Routines**: Configure calls for specific days/times
- **Interval Routines**: Recurring calls at set intervals
- **One-Time Routines**: Schedule single calls for future times
- Enable/disable routines easily
- Full routine management (create, edit, delete)

### 🟣 **Shake-to-Escape**
- Silent, discreet phone shake detection
- Triggers escape call automatically when enabled
- Haptic feedback confirmation
- Works even when app is backgrounded

### 📱 **Call History**
- Complete log of all triggered calls
- Timestamps and call details
- Status tracking (Success/Failed)
- Call SID tracking for Twilio integration

### ⚙️ **Settings Management**
- Configure your phone number
- Set default caller information
- Customize default escape message
- Manage backend API URL and authentication

---

## 🏗️ Project Structure

```
GetMeOut/
├── backend/                          # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py                  # FastAPI application & routes
│   ├── requirements.txt              # Python dependencies
│   └── .gitignore
│
├── frontend/                         # React Native (Expo) application
│   ├── screens/                      # Main app screens
│   │   ├── HomeScreen.tsx            # Main escape button & shake toggle
│   │   ├── CustomCallScreen.tsx      # Custom call configuration
│   │   ├── RoutinesScreen.tsx        # Routine list & management
│   │   ├── AddEditRoutineScreen.tsx  # Create/edit routines
│   │   ├── HistoryScreen.tsx         # Call history
│   │   └── SettingsScreen.tsx        # User settings
│   │
│   ├── components/                   # Reusable React components
│   │   ├── EscapeButton.tsx          # Large escape button
│   │   └── ShakeTriggerStatus.tsx    # Shake toggle indicator
│   │
│   ├── services/                     # Business logic & API communication
│   │   ├── api.ts                    # API service (Twilio calls)
│   │   └── storage.ts                # Local storage (AsyncStorage)
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useShakeDetection.ts      # Shake detection hook
│   │
│   ├── navigation/                   # Navigation setup
│   │   └── AppNavigator.tsx          # Tab & stack navigation
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── index.ts                  # Main types
│   │   ├── history.ts                # History types
│   │   └── navigation.ts             # Navigation types
│   │
│   ├── constants/                    # App configuration
│   │   └── config.ts                 # API & constants
│   │
│   ├── assets/                       # Images, icons, fonts
│   ├── App.tsx                       # Root app component
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   └── app.json                      # Expo configuration
│
├── design/                           # Design & documentation
│   ├── design.md                     # Technical architecture
│   ├── frontend-design.md            # UI/UX specifications
│   └── script.py                     # Design utilities
│
├── README.md                         # This file
└── LICENSE                           # Project license
```

---

## 🏛️ Architecture

### High-Level System Flow

```
┌────────────────────────┐
│   Mobile App (Expo)    │
│   - UI Components      │
│   - Shake Detection    │
│   - Local Storage      │
└────────────┬───────────┘
             │ HTTPS API Calls
             ▼
┌────────────────────────┐
│  Python Backend        │
│  (FastAPI + Uvicorn)   │
│  - REST Endpoints      │
│  - Business Logic      │
│  - Routine Scheduler   │
└────────────┬───────────┘
             │ Twilio SDK
             ▼
┌────────────────────────┐
│   Twilio Service       │
│   - Place Calls        │
│   - TwiML Generation   │
└────────────┬───────────┘
             ▼
┌────────────────────────┐
│   User's Phone         │
│   Receives Call        │
└────────────────────────┘
```

### Data Flow
1. **User Action** → Mobile app processes user input
2. **API Request** → Frontend sends HTTPS request to backend
3. **Business Logic** → Backend validates and processes request
4. **Twilio Integration** → Backend calls Twilio API
5. **Phone Call** → Twilio places call to user's phone
6. **History Tracking** → App logs call in local history

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native (Expo v54)
- **Language**: TypeScript
- **Navigation**: React Navigation 7
- **State Management**: React Hooks
- **Sensors**: expo-sensors (Accelerometer for shake detection)
- **Local Storage**: AsyncStorage
- **Haptics**: expo-haptics
- **UI Components**: Native React Native components

**Key Dependencies**:
```json
{
  "expo": "~54.0.30",
  "react-native": "0.81.5",
  "react": "19.1.0",
  "@react-navigation/native": "^7.1.26",
  "expo-sensors": "~15.0.8",
  "@react-native-async-storage/async-storage": "2.2.0",
  "expo-haptics": "~15.0.8"
}
```

### Backend
- **Framework**: FastAPI 0.95.0
- **Language**: Python 3
- **Server**: Uvicorn
- **Phone Service**: Twilio SDK
- **Database**: SQLAlchemy (for future database integration)
- **Authentication**: python-jose + passlib
- **Environment**: python-dotenv

**Key Dependencies**:
```
fastapi==0.95.0
uvicorn==0.21.1
twilio==8.0.0
sqlalchemy==2.0.5
pydantic==1.10.7
python-dotenv==1.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
psycopg2-binary==2.9.6
```

---

## 🚀 Setup & Installation

### Backend Setup

#### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Twilio account with API credentials

#### Steps

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file** in `/backend` directory:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   API_TOKEN=your_optional_api_token
   ```

5. **Run the server**:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The API will be available at: `http://localhost:8000`
   
   API Documentation: `http://localhost:8000/docs` (Swagger UI)

---

### Frontend Setup

#### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (optional)
- Expo Go app on physical device (for testing)

#### Steps

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API endpoint** in `constants/config.ts`:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'http://your-backend-url:8000',  // Change this to your backend URL
     ENDPOINTS: {
       ESCAPE: '/api/escape',
       CUSTOM_CALL: '/api/custom-call',
       ROUTINES: '/api/routines',
     }
   };
   ```

4. **Start the app**:
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on device/simulator**:
   - **iOS**: Press `i`
   - **Android**: Press `a`
   - **Web**: Press `w`
   - **Expo Go**: Scan QR code with Expo Go app

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8000  (local development)
https://your-backend-domain.com  (production)
```

### Authentication
Optional Bearer token authentication via `Authorization` header:
```
Authorization: Bearer YOUR_API_TOKEN
```

### Endpoints

#### 1. **Trigger Escape Call**
```http
POST /api/escape
Content-Type: application/json

{
  "to_number": "+916382230940",
  "from_number": "+1234567890",
  "message": "This is your escape call. You can leave now."
}
```

**Response**:
```json
{
  "success": true,
  "call_sid": "CAxxxxxxxxxxxxx",
  "error": null
}
```

---

#### 2. **Trigger Custom Call**
```http
POST /api/custom-call
Content-Type: application/json

{
  "to_number": "+916382230940",
  "from_number": "+1234567890",
  "contact_name": "Mom",
  "message": "Hey! Urgent! Come quickly!"
}
```

**Response**:
```json
{
  "success": true,
  "call_sid": "CAxxxxxxxxxxxxx",
  "error": null
}
```

---

#### 3. **Get All Routines**
```http
GET /api/routines
```

**Response**:
```json
[
  {
    "id": "uuid-string",
    "name": "Daily Escape",
    "time": "15:30",
    "days": ["Monday", "Wednesday"],
    "enabled": true,
    "to_number": "+916382230940",
    "message": "Regular check-in call"
  }
]
```

---

#### 4. **Create Routine**
```http
POST /api/routines
Content-Type: application/json

{
  "name": "Morning Call",
  "time": "08:00",
  "days": ["Monday", "Tuesday", "Wednesday"],
  "enabled": true,
  "to_number": "+916382230940",
  "message": "Good morning!"
}
```

**Response**:
```json
{
  "id": "uuid-string",
  "name": "Morning Call",
  "time": "08:00",
  "days": ["Monday", "Tuesday", "Wednesday"],
  "enabled": true,
  "to_number": "+916382230940",
  "message": "Good morning!"
}
```

---

#### 5. **Get Single Routine**
```http
GET /api/routines/{routine_id}
```

---

#### 6. **Update Routine**
```http
PUT /api/routines/{routine_id}
Content-Type: application/json

{
  "name": "Updated Call",
  "time": "09:00",
  "days": ["Monday"],
  "enabled": true,
  "to_number": "+916382230940",
  "message": "Updated message"
}
```

---

#### 7. **Delete Routine**
```http
DELETE /api/routines/{routine_id}
```

**Response**:
```json
{
  "message": "Routine deleted successfully"
}
```

---

#### 8. **Trigger Routine Call**
```http
POST /api/routines/{routine_id}/trigger
```

**Response**:
```json
{
  "success": true,
  "call_sid": "CAxxxxxxxxxxxxx",
  "error": null
}
```

---

#### 9. **Health Check**
```http
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-28T10:30:45.123456"
}
```

---

## 💡 Usage Guide

### For End Users

#### 1. **Initial Setup**
1. Open GetMeOut app
2. Go to **Settings** (⚙️ icon)
3. Enter your phone number
4. Set default caller name (e.g., "Emergency")
5. Set default caller number
6. Configure default escape message
7. Verify backend API URL
8. Save settings

#### 2. **Quick Escape**
1. Open app
2. Tap large **ESCAPE** button
3. Call will be triggered within seconds
4. Check **History** to see call details

#### 3. **Custom Call**
1. Go to **Custom Call** tab
2. Enter caller name (e.g., "Mom")
3. Enter callback number
4. Enter custom message
5. Tap **Trigger Call Now**
6. Call will be made with your custom details

#### 4. **Set Up Routines**
1. Go to **Routines** tab
2. Tap **+** button to create new routine
3. Select routine type:
   - **Daily**: Repeats at set time every day
   - **Weekly**: Repeats on specific days/time
   - **Interval**: Calls every N minutes
   - **One-Time**: Single call at specific time
4. Configure details (time, message, etc.)
5. Tap **Save Routine**
6. Toggle ON to enable

#### 5. **Enable Shake Detection**
1. On Home screen, toggle **Shake Trigger**
2. When enabled, shaking phone triggers escape call
3. Requires phone numbers configured in Settings

#### 6. **View History**
1. Go to **History** tab
2. See all triggered calls with timestamps
3. Check call status (Success/Failed)
4. View message and caller details

---

## ⚙️ Configuration

### Backend Configuration ([backend/app/main.py](backend/app/main.py))

Key environment variables:
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
API_TOKEN=optional_auth_token
```

CORS settings:
```python
allow_origins=["*"]  # Change to specific domain in production
```

### Frontend Configuration ([frontend/constants/config.ts](frontend/constants/config.ts))

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.x:8000',
  ENDPOINTS: {
    ESCAPE: '/api/escape',
    CUSTOM_CALL: '/api/custom-call',
    ROUTINES: '/api/routines',
  }
};

export const SHAKE_THRESHOLD = 1.4;  // Acceleration in g-force
export const SHAKE_DEBOUNCE_MS = 2000;  // Debounce duration
```

### AsyncStorage Keys ([frontend/services/storage.ts](frontend/services/storage.ts))

```typescript
STORAGE_KEYS = {
  SETTINGS: '@GetMeOut:settings',
  SHAKE_ENABLED: '@GetMeOut:shakeEnabled',
  CALL_HISTORY: '@GetMeOut:callHistory',
}
```

---

## Contact

If you come across any issues, have suggestions for improvement, or want to discuss further enhancements, feel free to contact me at [jaya2004kra@gmail.com](mailto:jaya2004kra@gmail.com). Your feedback is greatly appreciated.

---

## License

All the code and resources in this repository are licensed under the MIT License. You are free to use, modify, and distribute the code under the terms of this license. However, I do not take responsibility for the accuracy or reliability of the programs.