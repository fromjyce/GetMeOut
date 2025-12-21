import { EscapeCallRequest, CustomCallRequest } from '../types';
import { API_CONFIG } from '../constants/config';
import { storageService } from './storage';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const settings = await storageService.getSettings();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (settings.apiToken) {
      headers['Authorization'] = `Bearer ${settings.apiToken}`;
    }
    
    return headers;
  }

async triggerEscapeCall(
  toNumber: string,
  fromNumber: string,
  message: string
): Promise<{ success: boolean; callSid?: string; error?: string }> {
  try {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ESCAPE}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to_number: toNumber || undefined,  // Let the backend handle defaults
        from_number: fromNumber || undefined,  // Let the backend handle defaults
        message: message || "This is your escape call. You can leave now.",
      } as EscapeCallRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to trigger escape call');
    }

    const data = await response.json();
    return {
      success: true,
      callSid: data.call_sid,
    };
  } catch (error) {
    console.error('Error triggering escape call:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to trigger call';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

  async triggerCustomCall(request: CustomCallRequest): Promise<{ success: boolean; callSid?: string; error?: string }> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CUSTOM_CALL}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to trigger custom call');
      }

      const data = await response.json();
      
      // Save to history
      await storageService.saveCallHistory({
        type: 'custom',
        toNumber: request.to_number,
        fromNumber: request.from_number,
        message: request.message,
        status: 'success',
        // timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        callSid: data.call_sid,
      };
    } catch (error: unknown) {
      console.error('Error triggering custom call:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to trigger custom call';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const apiService = new ApiService();