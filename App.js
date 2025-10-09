// 🏠 App.js (Located in the project root)

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// AdminBottomTabNavigator is in the 'navigations' folder
import AdminBottomTabNavigator from './navigations/AdminBottomTabNavigator.js'; 
import AttendanceCheckerBottomNavigator from './navigations/AttendanceCheckerBottomNavigator.js'; 

// LoginScreen is in the 'screen' folder
import LoginScreen from './screen/LoginScreen'; 
import StudentFaciBottomNavigator from './navigations/StudentFaciBottomNavigator.js';

// 🚨 REMOVED: Dashboard import is no longer needed here as it's part of AdminBottomTabNavigator

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
        
        {/* 🚨 FIX: Changed name to "AdminTabs" to match the navigation call in LoginScreen.js */}
        <Stack.Screen name="AdminTabs" component={AdminBottomTabNavigator} />
        
        {/* The 'HomeTabs' is likely redundant, but kept here if it's referenced by non-admin flow */}
        <Stack.Screen name="AttendanceCheckerTabs" component={AttendanceCheckerBottomNavigator} />
        
        <Stack.Screen name="StudentFacilitatorTabs" component={StudentFaciBottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
