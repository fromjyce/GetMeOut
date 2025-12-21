import { EscapeCallRequest, CustomCallRequest, Routine } from '../types';
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

  async triggerCustomCall(
    request: CustomCallRequest | {
      to_number: string;
      from_number: string;
      contact_name: string;
      message: string;
    }
  ): Promise<{ success: boolean; callSid?: string; error?: string }> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CUSTOM_CALL}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          to_number: request.to_number,
          from_number: request.from_number,
          contact_name: request.contact_name,
          message: request.message || "This is your custom escape call.",
        } as CustomCallRequest),
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

  // Routine methods
  async getRoutines(): Promise<Routine[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROUTINES}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch routines');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching routines:', error);
      throw error;
    }
  }

  async createRoutine(routine: Omit<Routine, 'id'>): Promise<Routine> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROUTINES}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(routine),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create routine');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating routine:', error);
      throw error;
    }
  }

  async updateRoutine(id: string, routine: Omit<Routine, 'id'>): Promise<Routine> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROUTINES}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(routine),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update routine');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating routine:', error);
      throw error;
    }
  }

  async deleteRoutine(id: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROUTINES}/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete routine');
      }
    } catch (error) {
      console.error('Error deleting routine:', error);
      throw error;
    }
  }

  async triggerRoutine(id: string): Promise<{ success: boolean; callSid?: string; error?: string }> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROUTINES}/${id}/trigger`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to trigger routine');
      }

      return await response.json();
    } catch (error) {
      console.error('Error triggering routine:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to trigger routine';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const apiService = new ApiService();