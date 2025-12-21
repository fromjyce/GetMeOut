// screens/HistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { storageService } from '../services/storage';
import { CallHistoryItem } from '../types/history';
import { format } from 'date-fns';

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<CallHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadHistory = async () => {
    try {
      const historyData = await storageService.getCallHistory();
      // Transform the data to match our CallHistoryItem type
      const formattedHistory = historyData.map((item: any) => ({
        id: item.id || `${item.timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        type: item.type || 'custom',
        toNumber: item.toNumber || '',
        fromNumber: item.fromNumber || '',
        message: item.message,
        timestamp: item.timestamp,
        status: item.status || 'success',
        error: item.error,
      }));
      setHistory(formattedHistory);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const renderHistoryItem = ({ item }: { item: CallHistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyItemHeader}>
        <Text style={styles.historyItemType}>
          {item.type === 'escape' ? '🚨 Escape Call' : '📞 Custom Call'}
        </Text>
        <Text style={styles.historyItemTime}>
          {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
        </Text>
      </View>
      <View style={styles.historyItemContent}>
        <Text style={styles.historyItemNumber}>
          To: {item.toNumber}
        </Text>
        <Text style={styles.historyItemNumber}>
          From: {item.fromNumber}
        </Text>
        {item.message && (
          <Text style={styles.historyItemMessage} numberOfLines={2}>
            {item.message}
          </Text>
        )}
      </View>
      <View style={[
        styles.statusBadge,
        item.status === 'success' ? styles.statusSuccess : 
        item.status === 'failed' ? styles.statusFailed : styles.statusPending
      ]}>
        <Text style={styles.statusText}>
          {item.status === 'success' ? 'Success' : 
           item.status === 'failed' ? 'Failed' : 'Pending'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF3B30']}
            tintColor="#FF3B30"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No call history yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Your escape and custom calls will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyItemType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyItemTime: {
    fontSize: 12,
    color: '#888',
  },
  historyItemContent: {
    marginBottom: 8,
  },
  historyItemNumber: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  historyItemMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusSuccess: {
    backgroundColor: '#e6f7ee',
  },
  statusFailed: {
    backgroundColor: '#fde8e8',
  },
  statusPending: {
    backgroundColor: '#fff8e6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HistoryScreen;