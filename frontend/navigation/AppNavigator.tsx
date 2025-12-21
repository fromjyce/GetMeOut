import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { CustomCallScreen } from '../screens/CustomCallScreen';
import { RootStackParamList } from '../types/navigation';

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Main App Navigator component
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
