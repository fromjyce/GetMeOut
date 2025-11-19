import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

const STORAGE_KEYS = {
  SETTINGS: '@GetMeOut:settings',
  SHAKE_ENABLED: '@GetMeOut:shakeEnabled',
  CALL_HISTORY: '@GetMeOut:callHistory',
};

export const storageService = {
  // Settings
  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    const existing = await this.getSettings();
    const updated = { ...existing, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  },

  async getSettings(): Promise<AppSettings> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
    return {
      userPhoneNumber: '',
      defaultCallerName: 'Emergency',
      defaultCallerNumber: '',
      defaultMessage: "This is your official escape call. Time to get out of that awkward situation. Act natural.",
      backendUrl: API_CONFIG.BASE_URL,
    };
  },

  // Shake Trigger
  async saveShakeEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SHAKE_ENABLED, JSON.stringify(enabled));
  },

  async getShakeEnabled(): Promise<boolean> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SHAKE_ENABLED);
    return data ? JSON.parse(data) : false;
  },

  // Call History
  async saveCallHistory(historyItem: any): Promise<void> {
    const history = await this.getCallHistory();
    history.unshift({
      ...historyItem,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 100 entries
    const limited = history.slice(0, 100);
    await AsyncStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(limited));
  },

  async getCallHistory(): Promise<any[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CALL_HISTORY);
    return data ? JSON.parse(data) : [];
  },
};

// Import API_CONFIG for default settings
import { API_CONFIG } from '../constants/config';