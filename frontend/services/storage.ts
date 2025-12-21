import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';
import { CallHistoryItem } from '../types/history';

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

  async saveCallHistory(historyItem: Omit<CallHistoryItem, 'id' | 'timestamp'>): Promise<void> {
    const history = await this.getCallHistory();
    const newItem: CallHistoryItem = {
      ...historyItem,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    history.unshift(newItem);
    // Keep only last 100 entries
    const limited = history.slice(0, 100);
    await AsyncStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(limited));
  },
  async getCallHistory(): Promise<CallHistoryItem[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CALL_HISTORY);
    return data ? JSON.parse(data) : [];
  },
  async clearCallHistory(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.CALL_HISTORY);
  },
};

// Import API_CONFIG for default settings
import { API_CONFIG } from '../constants/config';