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
          to_number: toNumber,
          from_number: fromNumber,
          message: message,
        } as EscapeCallRequest),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Save to history
        await storageService.saveCallHistory({
          type: 'escape',
          toNumber,
          fromNumber,
          message,
          callSid: data.call_sid,
          status: 'success',
        });
        
        return { success: true, callSid: data.call_sid };
      } else {
        return { success: false, error: data.message || 'Failed to trigger call' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }

  async triggerCustomCall(
    toNumber: string,
    fromNumber: string,
    contactName: string,
    message: string
  ): Promise<{ success: boolean; callSid?: string; error?: string }> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CUSTOM_CALL}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          to_number: toNumber,
          from_number: fromNumber,
          contact_name: contactName,
          message: message,
        } as CustomCallRequest),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Save to history
        await storageService.saveCallHistory({
          type: 'custom',
          toNumber,
          fromNumber,
          contactName,
          message,
          callSid: data.call_sid,
          status: 'success',
        });
        
        return { success: true, callSid: data.call_sid };
      } else {
        return { success: false, error: data.message || 'Failed to trigger call' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }
}

export const apiService = new ApiService();