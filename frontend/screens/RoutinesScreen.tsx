// screens/RoutinesScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, Routine } from '../types/navigation';

type RoutinesScreenRouteProp = RouteProp<RootStackParamList, 'Routines'>;
type RoutinesScreenNavigationProp = NavigationProp<RootStackParamList, 'Routines'>;

interface RoutinesScreenProps {
  navigation: RoutinesScreenNavigationProp;
  route: RoutinesScreenRouteProp;
}

const RoutinesScreen: React.FC<RoutinesScreenProps> = ({ navigation, route }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  // Load saved routines on component mount
  useEffect(() => {
    const loadRoutines = async () => {
      try {
        console.log('Loading routines from storage...');
        const savedRoutines = await AsyncStorage.getItem('routines');
        console.log('Saved routines from storage:', savedRoutines);
        if (savedRoutines) {
          const parsedRoutines = JSON.parse(savedRoutines);
          console.log('Parsed routines:', parsedRoutines);
          
          // Merge with existing routines, removing any duplicates by ID
          setRoutines(prevRoutines => {
            const existingIds = new Set(prevRoutines.map(r => r.id));
            const newRoutines = Array.isArray(parsedRoutines) 
              ? parsedRoutines.filter(r => !existingIds.has(r.id))
              : [];
            console.log('Merged routines:', [...prevRoutines, ...newRoutines]);
            return [...prevRoutines, ...newRoutines];
          });
        }
      } catch (error) {
        console.error('Failed to load routines', error);
        // Initialize with empty array if there's an error
        setRoutines([]);
      }
    };
    
    loadRoutines();
  }, []);

  // Save routines whenever they change
  useEffect(() => {
    const saveRoutines = async () => {
      try {
        console.log('Saving routines:', routines);
        await AsyncStorage.setItem('routines', JSON.stringify(routines));
        console.log('Successfully saved routines to storage');
      } catch (error) {
        console.error('Failed to save routines', error);
      }
    };
    
    // Always save routines, even if the array is empty
    saveRoutines();
  }, [routines]);

  const handleAddRoutine = () => {
  navigation.navigate('AddEditRoutine', {
    onSave: (newRoutine: Omit<Routine, 'id'>) => {
      const newRoutineWithId = {
        ...newRoutine,
        id: Date.now().toString(),
      };
      setRoutines(prev => [...prev, newRoutineWithId]);
      navigation.goBack();
    }
  });
};


  // Handle new routine when returning from AddEditRoutine screen
  useFocusEffect(
    useCallback(() => {
      if (route.params?.newRoutine) {
        const { newRoutine } = route.params;
        console.log('New routine received:', newRoutine);
        
        const newRoutineWithId = {
          ...newRoutine,
          id: Date.now().toString(),
          enabled: true
        };
        
        console.log('Adding new routine:', newRoutineWithId);
        
        // Merge with existing routines instead of replacing
        setRoutines(prevRoutines => {
          // Filter out any routine with the same name to prevent duplicates
          const updated = prevRoutines.filter(r => r.name !== newRoutine.name);
          updated.push(newRoutineWithId);
          console.log('Updated routines:', updated);
          return updated;
        });
        
        // Clear params after a short delay to ensure state updates
        setTimeout(() => {
          navigation.setParams({ newRoutine: undefined });
        }, 100);
      }
    }, [route.params?.newRoutine, navigation])
  );

  const toggleRoutine = (id: string) => {
    setRoutines(prevRoutines => 
      prevRoutines.map(routine => 
        routine.id === id ? { ...routine, enabled: !routine.enabled } : routine
      )
    );
  };

  const renderRoutineItem = ({ item }: { item: Routine }) => (
    <View style={styles.routineItem}>
      <View style={styles.routineInfo}>
        <Text style={styles.routineName}>{item.name}</Text>
        <Text style={styles.routineTime}>{item.time}</Text>
        <Text style={styles.routineDays}>{Array.isArray(item.days) ? item.days.join(', ') : ''}</Text>
      </View>
      <TouchableOpacity
        style={[styles.toggleButton, item.enabled && styles.toggleButtonActive]}
        onPress={() => toggleRoutine(item.id)}
      >
        <Text style={styles.toggleText}>{item.enabled ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>
    </View>
  );

  console.log('Rendering RoutinesScreen. Number of routines:', routines.length);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={routines}
        renderItem={renderRoutineItem}
        keyExtractor={item => item.id}
        extraData={routines.length} // Force re-render when routines change
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 20 // Add some padding at the bottom
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No routines yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first routine to get started</Text>
          </View>
        }
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAddRoutine}
      >
        <Text style={styles.addButtonText}>+ Add Routine</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  routineItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  routineTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  routineDays: {
    fontSize: 14,
    color: '#888',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default RoutinesScreen;