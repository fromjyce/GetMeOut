import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppSettings } from '../types';
import { storageService } from '../services/storage';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    userPhoneNumber: '',
    defaultCallerName: 'Unknown',
    defaultCallerNumber: '',
    defaultMessage: 'I need to go, call you later!',
    backendUrl: 'http://localhost:8000',
    apiToken: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await storageService.getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings.userPhoneNumber) {
      Alert.alert('Error', 'Your phone number is required');
      return;
    }

    if (!settings.defaultCallerNumber) {
      Alert.alert('Error', 'Default caller number is required');
      return;
    }

    setSaving(true);
    try {
      await storageService.saveSettings(settings);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const defaultSettings: AppSettings = {
      userPhoneNumber: '',
      defaultCallerName: 'Unknown',
      defaultCallerNumber: '',
      defaultMessage: 'I need to go, call you later!',
      backendUrl: 'http://localhost:8000',
      apiToken: ''
    };
    
    setSettings(defaultSettings);
    await storageService.saveSettings(defaultSettings);
    Alert.alert('Success', 'Settings reset to defaults');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Phone Settings</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Phone Number (E.164 format)</Text>
        <TextInput
          style={styles.input}
          value={settings.userPhoneNumber}
          onChangeText={(text) => setSettings({...settings, userPhoneNumber: text})}
          placeholder="+1234567890"
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.sectionTitle}>Default Caller</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Caller Name</Text>
        <TextInput
          style={styles.input}
          value={settings.defaultCallerName}
          onChangeText={(text) => setSettings({...settings, defaultCallerName: text})}
          placeholder="Unknown"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Caller Number (E.164 format)</Text>
        <TextInput
          style={styles.input}
          value={settings.defaultCallerNumber}
          onChangeText={(text) => setSettings({...settings, defaultCallerNumber: text})}
          placeholder="+1234567890"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Default Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={settings.defaultMessage}
          onChangeText={(text) => setSettings({...settings, defaultMessage: text})}
          placeholder="I need to go, call you later!"
          multiline
          numberOfLines={3}
        />
      </View>

      <Text style={styles.sectionTitle}>API Settings</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Backend URL</Text>
        <TextInput
          style={styles.input}
          value={settings.backendUrl}
          onChangeText={(text) => setSettings({...settings, backendUrl: text})}
          placeholder="http://localhost:8000"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>API Token (Optional)</Text>
        <TextInput
          style={styles.input}
          value={settings.apiToken || ''}
          onChangeText={(text) => setSettings({...settings, apiToken: text})}
          placeholder="Leave empty if not required"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Settings</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={handleReset}
          disabled={saving}
        >
          <Text style={[styles.buttonText, {color: '#FF3B30'}]}>Reset to Defaults</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#FF3B30',
  },
  resetButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
