import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface ShakeTriggerStatusProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const ShakeTriggerStatus: React.FC<ShakeTriggerStatusProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Shake Trigger:</Text>
      <View style={styles.switchContainer}>
        <Text style={[styles.status, enabled && styles.statusEnabled]}>
          {enabled ? 'ON' : 'OFF'}
        </Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#34C759' }}
          thumbColor={enabled ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  statusEnabled: {
    color: '#34C759',
  },
});