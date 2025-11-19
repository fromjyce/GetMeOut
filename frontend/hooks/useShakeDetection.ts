import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { SHAKE_THRESHOLD } from '../constants/config';
import { storageService } from '../services/storage';
import { apiService } from '../services/api';

export const useShakeDetection = (
  onShakeDetected?: () => void
) => {
  const lastShakeTime = useRef<number>(0);
  const shakeEnabled = useRef<boolean>(false);

  useEffect(() => {
    // Load shake enabled state
    storageService.getShakeEnabled().then((enabled) => {
      shakeEnabled.current = enabled;
    });

    // Subscribe to accelerometer
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      // Check if shake is enabled and threshold is met
      if (shakeEnabled.current && acceleration > SHAKE_THRESHOLD) {
        // Debounce: prevent multiple triggers within 2 seconds
        if (now - lastShakeTime.current > 2000) {
          lastShakeTime.current = now;
          
          // Haptic feedback
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
          // Trigger escape call
          handleShakeTrigger();
          
          // Callback if provided
          if (onShakeDetected) {
            onShakeDetected();
          }
        }
      }
    });

    // Set update interval (60 Hz)
    Accelerometer.setUpdateInterval(16);

    return () => {
      subscription.remove();
    };
  }, [onShakeDetected]);

  const handleShakeTrigger = async () => {
    const settings = await storageService.getSettings();
    
    if (!settings.userPhoneNumber || !settings.defaultCallerNumber) {
      console.warn('Phone numbers not configured');
      return;
    }

    await apiService.triggerEscapeCall(
      settings.userPhoneNumber,
      settings.defaultCallerNumber,
      settings.defaultMessage
    );
  };

  return {
    setShakeEnabled: async (enabled: boolean) => {
      shakeEnabled.current = enabled;
      await storageService.saveShakeEnabled(enabled);
    },
  };
};