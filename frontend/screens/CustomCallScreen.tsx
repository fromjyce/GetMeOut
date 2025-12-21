import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

export const CustomCallScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    toNumber: '',
    fromNumber: '',
    message: 'I need to leave soon. Can we talk later?',
  });
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await storageService.getSettings();
    setSettings(savedSettings);
    
    // Pre-fill the form with saved settings if available
    if (savedSettings) {
      setFormData(prev => ({
        ...prev,
        toNumber: savedSettings.userPhoneNumber || '',
        fromNumber: savedSettings.defaultCallerNumber || '',
        message: savedSettings.defaultMessage || prev.message,
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // screens/CustomCallScreen.tsx
// Add this to the handleSubmit function
const handleSubmit = async () => {
  if (!formData.toNumber || !formData.fromNumber) {
    Alert.alert('Error', 'Please fill in all required fields');
    return;
  }

  setLoading(true);
  try {
    const result = await apiService.triggerEscapeCall(
      formData.toNumber,
      formData.fromNumber,
      formData.message
    );

    // Save to history
    await storageService.saveCallHistory({
      type: 'custom',
      toNumber: formData.toNumber,
      fromNumber: formData.fromNumber,
      message: formData.message,
      status: result.success ? 'success' : 'failed',
      error: result.error,
    });

    if (result.success) {
      Alert.alert('Success', 'Custom call has been triggered!');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'Failed to trigger call');
    }
  } catch (error) {
    console.error('Error triggering call:', error);
    Alert.alert('Error', 'An unexpected error occurred');
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StatusBar style="auto" />
        
        <View style={styles.header}>
          <Text style={styles.title}>Custom Call</Text>
          <Text style={styles.subtitle}>Configure your custom escape call</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Phone Number*</Text>
          <TextInput
            style={styles.input}
            placeholder="+1234567890"
            value={formData.toNumber}
            onChangeText={(text) => handleInputChange('toNumber', text)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Caller ID Number*</Text>
          <TextInput
            style={styles.input}
            placeholder="+1987654321"
            value={formData.fromNumber}
            onChangeText={(text) => handleInputChange('fromNumber', text)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter your message..."
            value={formData.message}
            onChangeText={(text) => handleInputChange('message', text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Trigger Call</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
