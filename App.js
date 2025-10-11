// 🏠 App.js (Located in the project root)

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the platform-specific navigator instead of the bottom tab navigator directly
import AdminNavigator from './navigations/AdminNavigator'; // This will conditionally render drawer/tabs
import AttendanceCheckerBottomNavigator from './navigations/AttendanceCheckerBottomNavigator.js'; 
import StudentFaciBottomNavigator from './navigations/StudentFaciBottomNavigator.js';

// LoginScreen is in the 'screen' folder
import LoginScreen from './screen/LoginScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        
        {/* The first screen is the starting point */}
        <Stack.Screen name="Login" component={LoginScreen}/>
        
        {/* 🚨 UPDATED: Use AdminNavigator instead of AdminBottomTabNavigator */}
        <Stack.Screen name="AdminTabs" component={AdminNavigator} />
        
        {/* Keep other navigators as they are */}
        <Stack.Screen name="AttendanceCheckerTabs" component={AttendanceCheckerBottomNavigator} />
        <Stack.Screen name="StudentFacilitatorTabs" component={StudentFaciBottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}