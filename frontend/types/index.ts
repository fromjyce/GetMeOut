export interface EscapeCallRequest {
    to_number: string;
    from_number: string;
    message: string;
  }
  
  export interface CustomCallRequest {
    to_number: string;
    from_number: string;
    contact_name: string;
    message: string;
  }
  
  export interface AppSettings {
    userPhoneNumber: string;
    defaultCallerName: string;
    defaultCallerNumber: string;
    defaultMessage: string;
    backendUrl: string;
    apiToken?: string;
  }

  export interface Routine {
    id: string;
    name: string;
    time: string;
    days: string[];
    enabled: boolean;
    to_number: string;
    message: string;
  }