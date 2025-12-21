import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { EscapeButton } from '../components/EscapeButton';
import { ShakeTriggerStatus } from '../components/ShakeTriggerStatus';
import { useShakeDetection } from '../hooks/useShakeDetection';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { AppSettings } from '../types';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const { setShakeEnabled: updateShakeEnabled } = useShakeDetection(() => {
    setStatusMessage('Shake detected! Call triggered.');
    setTimeout(() => setStatusMessage(''), 3000);
  });

  useEffect(() => {
    loadSettings();
    loadShakeStatus();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await storageService.getSettings();
    setSettings(loadedSettings);
  };

  const loadShakeStatus = async () => {
    const enabled = await storageService.getShakeEnabled();
    setShakeEnabled(enabled);
  };

  const handleEscapePress = async () => {
    if (!settings) {
      Alert.alert('Settings Required', 'Please configure your phone number and default caller in Settings.');
      return;
    }

    if (!settings.userPhoneNumber || !settings.defaultCallerNumber) {
      Alert.alert(
        'Configuration Required',
        'Please set your phone number and default caller number in Settings first.'
      );
      return;
    }

    setLoading(true);
    setStatusMessage('');

    const result = await apiService.triggerEscapeCall(
      settings.userPhoneNumber,
      settings.defaultCallerNumber,
      settings.defaultMessage
    );

    setLoading(false);

    if (result.success) {
      setStatusMessage(`Call initiated! SID: ${result.callSid}`);
      Alert.alert('Success', 'Escape call has been triggered!');
    } else {
      setStatusMessage(`Error: ${result.error}`);
      Alert.alert('Error', result.error || 'Failed to trigger call');
    }

    // Clear status message after 5 seconds
    setTimeout(() => setStatusMessage(''), 5000);
  };

  const handleShakeToggle = async (enabled: boolean) => {
    setShakeEnabled(enabled);
    await updateShakeEnabled(enabled);
  };

  const navigateToScreen = (
    screenName: keyof RootStackParamList,
    params?: any
  ) => {
    navigation.navigate(screenName as any, params);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>GetMeOut</Text>
          <Text style={styles.subtitle}>Your escape call assistant</Text>
        </View>

        <View style={styles.escapeSection}>
          <EscapeButton onPress={handleEscapePress} loading={loading} />
          {statusMessage ? (
            <Text style={styles.statusText}>{statusMessage}</Text>
          ) : null}
        </View>

        <View style={styles.settingsSection}>
          <ShakeTriggerStatus
            enabled={shakeEnabled}
            onToggle={handleShakeToggle}
          />
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigateToScreen('CustomCall')}
          >
            <Text style={styles.actionButtonText}>Custom Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigateToScreen('Routines')}
          >
            <Text style={styles.actionButtonText}>Routines</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigateToScreen('History')}
          >
            <Text style={styles.actionButtonText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.settingsButton]}
            onPress={() => navigateToScreen('Settings')}
          >
            <Text style={[styles.actionButtonText, styles.settingsButtonText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  escapeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  statusText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: 24,
  },
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: '#f5f5f5',
    marginTop: 8,
  },
  settingsButtonText: {
    color: '#333',
  },
});