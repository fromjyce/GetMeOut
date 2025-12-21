// navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { CustomCallScreen } from '../screens/CustomCallScreen';
import RoutinesScreen from '../screens/RoutinesScreen';
import { AddEditRoutineScreen } from '../screens/AddEditRoutineScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'GetMeOut',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CustomCall"
          component={CustomCallScreen}
          options={{
            title: 'Custom Call',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="Routines"
          component={RoutinesScreen}
          options={{
            title: 'Routines',
            headerBackTitle: 'Back',
          }}
        />
          <Stack.Screen
            name="AddEditRoutine"
            component={AddEditRoutineScreen}
            options={({ route }) => ({
              title: route.params?.routineId ? 'Edit Routine' : 'Add Routine',
              headerBackTitle: 'Cancel',
            })}
          />
        {/* Add more screens here as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};