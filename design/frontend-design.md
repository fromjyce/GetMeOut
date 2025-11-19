## 📱 **Pages/Screens Required**

### **1. Home Screen** (`screens/HomeScreen.tsx`)
**Purpose:** Main entry point with quick escape button

**Components:**
- `EscapeButton` — Large, prominent button to trigger immediate escape call
- `ShakeTriggerStatus` — Display showing "Shake Trigger: ON/OFF" with toggle
- `NavigationButton` — Buttons to navigate to:
  - "Custom Call" → CustomCallScreen
  - "Routines" → RoutineListScreen
  - "History" → HistoryScreen
- `LoadingIndicator` — Shows when call is being triggered
- `StatusMessage` — Success/error messages after call trigger

**Features:**
- Shake detection listener (using `expo-sensors`)
- Background task registration
- Quick escape call API call

---

### **2. Custom Call Screen** (`screens/CustomCallScreen.tsx`)
**Purpose:** Configure and trigger a custom escape call

**Components:**
- `TextInput` — Caller Name (e.g., "Mom", "Boss")
- `TextInput` — Callback Number (fake caller number in E.164 format)
- `TextInput` — Message (multiline text input for custom message)
- `Button` — "Trigger Call Now" (submits to `/custom-call` API)
- `PhoneNumberInput` — Formatted phone number input with validation
- `LoadingIndicator` — Shows during API call
- `StatusMessage` — Success/error feedback

**Features:**
- Form validation
- API call to backend `/custom-call` endpoint
- Navigation back to Home after success

---

### **3. Routine List Screen** (`screens/RoutineListScreen.tsx`)
**Purpose:** View and manage all scheduled routines

**Components:**
- `RoutineList` — FlatList/ScrollView displaying all routines
- `RoutineItem` — Individual routine card showing:
  - Routine type (Daily/Weekly/Interval/One-Time/Shake)
  - Time/interval information
  - Message preview
  - Toggle switch (ON/OFF)
  - Edit button
  - Delete button
- `FAB` (Floating Action Button) — "+" button to add new routine
- `EmptyState` — Message when no routines exist
- `LoadingIndicator` — While fetching routines

**Features:**
- Fetch routines from `/routine` GET endpoint
- Toggle routine enabled/disabled (PATCH `/routine/:id`)
- Delete routine (DELETE `/routine/:id`)
- Navigate to Add/Edit Routine screen

---

### **4. Add/Edit Routine Screen** (`screens/AddEditRoutineScreen.tsx`)
**Purpose:** Create or edit a scheduled routine

**Components:**
- `RoutineTypePicker` — Dropdown/Picker for:
  - Daily
  - Weekly
  - Interval
  - One-Time
  - Shake Routine
- `TimePicker` — Native time picker (for Daily/Weekly/One-Time)
- `DayOfWeekPicker` — Day selector (for Weekly routines)
- `IntervalInput` — Number input for minutes (for Interval routines)
- `TextInput` — Message input
- `PhoneNumberInput` — Caller number input
- `Button` — "Save Routine" (POST `/routine` or PATCH `/routine/:id`)
- `Button` — "Cancel" (navigate back)
- `LoadingIndicator` — During save operation
- `StatusMessage` — Success/error feedback

**Features:**
- Conditional rendering based on routine type
- Form validation
- Create or update routine via API
- Navigation back to Routine List after save

---

### **5. History Screen** (`screens/HistoryScreen.tsx`)
**Purpose:** View call history/logs

**Components:**
- `HistoryList` — FlatList/ScrollView of call history
- `HistoryItem` — Individual history entry showing:
  - Date/time of call
  - Caller name/number
  - Message preview
  - Status (Success/Failed)
  - Call SID (if available)
- `EmptyState` — Message when no history exists
- `RefreshControl` — Pull to refresh
- `FilterButton` — Filter by date/status (optional)

**Features:**
- Store call history locally (AsyncStorage or SQLite)
- Display chronological list
- Optional: Filter and search

---

### **6. Settings Screen** (`screens/SettingsScreen.tsx`) *(Recommended)*
**Purpose:** Configure app settings and user preferences

**Components:**
- `PhoneNumberInput` — User's phone number (stored locally)
- `TextInput` — Default caller name
- `TextInput` — Default caller number
- `TextInput` — Default escape message
- `TextInput` — Backend API URL
- `TextInput` — API Token (optional, for security)
- `Button` — "Save Settings"
- `Button` — "Reset to Defaults"

**Features:**
- Store settings in AsyncStorage
- Load settings on app start
- Use defaults for escape calls

---

## 🧩 **Shared/Reusable Components**

### **1. API Service** (`services/api.ts`)
**Purpose:** Centralized API communication

**Functions:**
- `triggerEscapeCall(toNumber, fromNumber, message)`
- `triggerCustomCall(toNumber, fromNumber, contactName, message)`
- `getRoutines()`
- `createRoutine(routineData)`
- `updateRoutine(id, routineData)`
- `deleteRoutine(id)`
- `toggleRoutine(id, enabled)`

---

### **2. Shake Detection Hook** (`hooks/useShakeDetection.ts`)
**Purpose:** Detect phone shake gestures

**Features:**
- Uses `expo-sensors` Accelerometer
- Threshold detection (>1.4g)
- Callback when shake detected
- Haptic feedback (vibration)

---

### **3. Background Task Manager** (`services/backgroundTasks.ts`)
**Purpose:** Handle background scheduling

**Features:**
- Register background fetch task
- Check for scheduled routines
- Trigger calls when conditions met
- Works when app is backgrounded

---

### **4. Storage Service** (`services/storage.ts`)
**Purpose:** Local data persistence

**Functions:**
- `savePhoneNumber(number)`
- `getPhoneNumber()`
- `saveDefaultSettings(settings)`
- `getDefaultSettings()`
- `saveCallHistory(historyItem)`
- `getCallHistory()`
- `saveRoutines(routines)` (optional local cache)

---

### **5. Navigation Setup** (`navigation/AppNavigator.tsx`)
**Purpose:** React Navigation configuration

**Stack Navigator with screens:**
- Home
- CustomCall
- RoutineList
- AddEditRoutine
- History
- Settings

---

## 📁 **Recommended Folder Structure**

```
frontend/
├── screens/
│   ├── HomeScreen.tsx
│   ├── CustomCallScreen.tsx
│   ├── RoutineListScreen.tsx
│   ├── AddEditRoutineScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── components/
│   ├── EscapeButton.tsx
│   ├── RoutineItem.tsx
│   ├── HistoryItem.tsx
│   ├── PhoneNumberInput.tsx
│   ├── LoadingIndicator.tsx
│   └── StatusMessage.tsx
├── services/
│   ├── api.ts
│   ├── storage.ts
│   └── backgroundTasks.ts
├── hooks/
│   ├── useShakeDetection.ts
│   └── useRoutines.ts
├── types/
│   └── index.ts (TypeScript types/interfaces)
├── navigation/
│   └── AppNavigator.tsx
└── constants/
    └── config.ts (API URLs, thresholds, etc.)
```

---

## 🔑 **Key Features to Implement**

1. Shake detection — Works globally (can be in App.tsx or HomeScreen)
2. Background tasks — Register in App.tsx using `expo-task-manager`
3. Local storage — Store user phone number, settings, and call history
4. API integration — All backend endpoints from design doc
5. Error handling — Network errors, validation errors, user feedback
6. Loading states — Show loading indicators during API calls
7. Navigation — Stack navigation between all screens