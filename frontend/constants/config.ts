export const API_CONFIG = {
    // Update this with your backend URL
    BASE_URL: __DEV__ 
      ? 'http://localhost:8000'  // Development
      : 'https://your-backend-url.com',  // Production
    ENDPOINTS: {
      ESCAPE: '/escape',
      CUSTOM_CALL: '/custom-call',
      ROUTINES: '/routine',
    },
  };
  
  export const SHAKE_THRESHOLD = 1.4; // g-force threshold for shake detection
  export const DEFAULT_MESSAGE = "This is your official escape call. Time to get out of that awkward situation. Act natural.";