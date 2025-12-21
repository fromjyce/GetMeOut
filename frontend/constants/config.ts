export const API_CONFIG = {
    BASE_URL: __DEV__ 
      ? 'http://192.168.0.10:8000'  // Development
      : 'http://localhost:8000',  // Production
    ENDPOINTS: {
      ESCAPE: '/api/escape',
      CUSTOM_CALL: '/api/custom-call',
      ROUTINES: '/api/routine',
    },
};
  
  export const SHAKE_THRESHOLD = 1.4; // g-force threshold for shake detection
  export const DEFAULT_MESSAGE = "This is your official escape call. Time to get out of that awkward situation. Act natural.";