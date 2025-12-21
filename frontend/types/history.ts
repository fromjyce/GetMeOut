// types/history.ts
export type CallHistoryItem = {
  id: string;
  type: 'escape' | 'custom';
  toNumber: string;
  fromNumber: string;
  message?: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  error?: string;
};