# 📘 **DESIGN DOCUMENT — GetMeOut App (Expo + Python + Twilio)**

## 📌 **Project Overview**

The GetMeOut App gives users a quick and discreet way to exit awkward or boring situations.
It triggers a fake phone call using Twilio, with configurable caller name, caller number, and audio message.

The app includes:

* One-tap escape call
* Custom call setup
* Routines (scheduled calls)
* Shake-to-Trigger silent escape
* Background task scheduling
* Server-based execution for 100% reliability

---

# 🎯 **Goals**

1. Provide a quick, reliable escape mechanism.
2. Allow users to customize caller identity & audio/message.
3. Enable advanced routines similar to Alexa:

   * Time-based triggers
   * Interval triggers
   * Shake triggers
4. Make it work even when:

   * Screen is off
   * App is backgrounded
   * No internet (routine executes whenever back online)

---

# 🚫 **Non-Goals**

* The app will NOT place direct calls using the device (blocked by iOS/Android security).
* No storing or accessing user’s real contacts (privacy-first).
* No fake UI call screens (OS-level restrictions).

---

# 🏗️ **High-Level Architecture**

```
         ┌────────────────────────┐
         │      Mobile App        │
         │      (Expo RN)         │
         └──────────┬─────────────┘
                    │ HTTPS
                    ▼
         ┌────────────────────────┐
         │     Python Backend     │
         │   (FastAPI / Flask)    │
         └──────────┬─────────────┘
                    │ Twilio SDK
                    ▼
         ┌────────────────────────┐
         │        Twilio          │
         │ Makes actual phone call│
         └──────────┬─────────────┘
                    ▼
         ┌────────────────────────┐
         │     User's Phone       │
         │     Receives call      │
         └────────────────────────┘
```

---

# 🧩 **System Components**

## **1. Mobile App (Expo React Native)**

### Responsibilities:

* UI (escape button, custom call, schedules)
* Shake detection using `expo-sensors`
* Background scheduling using:

  * `expo-task-manager`
  * `expo-background-fetch`
* Stores user preferences & routines locally
* Makes API calls to backend

---

## **2. Backend (FastAPI Recommended)**

### Responsibilities:

* Handle call trigger requests
* Generate TwiML (voice message)
* Integrate with Twilio to place real calls
* Store routines in database
* Cron scheduler checks and executes upcoming routines

---

## **3. Twilio Service**

### Responsibilities:

* Place phone calls to user's mobile
* Play text-to-speech message
* Mask number as chosen incoming caller

---

# 🖥️ **Mobile App Features in Detail**

## **🔴 1. Escape Button**

* One tap
* Sends: user phone number, default caller, default message
* Backend immediately triggers Twilio call

API:

```
POST /escape
{
  "to_number": "+91XXXX",
  "from_number": "+1XXXXX",
  "message": "Default escape call message"
}
```

---

## **🟡 2. Custom Call Setup**

User enters:

* Caller name ("Mom")
* Fake caller number
* Custom message

API:

```
POST /custom-call
{
  "to_number": "+91XXXX",
  "from_number": "+1VIRTUAL",
  "contact_name": "Mom",
  "message": "Hey! Urgent! Come quickly!"
}
```

---

## **🔵 3. Routines (Alexa-style Scheduled Calls)**

### Routine Types:

1. **Daily** — e.g., "Every day at 4:00 PM"
2. **Weekly** — e.g., "Every Monday at 8 PM"
3. **Interval** — e.g., "Call me every 15 minutes"
4. **One-Time** — e.g., "Call me at 3:15 PM"
5. **Shake Routine** — trigged only when user shakes phone

### Stored in DB:

```
{
  id: uuid,
  type: "daily | weekly | interval | one_time",
  time: "15:30",
  day_of_week: 1,
  interval_minutes: 20,
  message: "...",
  from_number: "...",
  to_number: "...",
  enabled: true
}
```

---

## **🟣 4. Silent Trigger (Shake to Escape)**

Using Expo Accelerometer:

* Detect strong shakes (`threshold > 1.4g`)
* If shake routine enabled:

  * Vibrate quietly
  * Trigger backend call

---

# 🛠️ **Backend Architecture**

## Endpoints

### `POST /escape`

Triggers default escape.

### `POST /custom-call`

Triggers user-configured call.

### `POST /routine`

Creates a new routine.

### `GET /routine`

Returns all routines.

### `PATCH /routine/:id`

Edits routine.

### `DELETE /routine/:id`

Deletes routine.

### `POST /execute-scheduled`

Called by cron every minute.

---

## Cron Scheduler (Backend)

Runs every minute:

1. Fetch active routines
2. Compare current time with routine time
3. If match → call Twilio
4. Update last_triggered timestamp
5. Loop

---

# 📱 **UI / UX Flow**

## **Home Screen**

* Big “ESCAPE” button
* Status: “Shake Trigger: ON/OFF”
* Button: “Custom Call”
* Button: “Routines”
* Button: “History”

---

## **Custom Call Screen**

* Input: Caller Name
* Input: Callback Number
* Input: Message
* Submit Button → “Trigger Call Now”

---

## **Routine List Screen**

* List of routines
* Toggle On/Off
* Add + button

---

## **Add Routine Screen**

* Dropdown: Daily / Weekly / Interval / One-Time
* Time Picker
* Message Input
* Caller Number Input
* Save Routine

---

# 🔐 **Security**

* All communication is HTTPS
* API token required for every request
* User phone number stored only locally
* No access to real contacts

---

# 📦 **Tech Stack**

### Frontend (App)

* Expo React Native
* expo-sensors
* expo-notifications
* expo-background-fetch
* expo-file-system
* React Navigation

### Backend

* FastAPI or Flask
* Twilio Python SDK
* SQLite / Postgres
* APScheduler or cron
