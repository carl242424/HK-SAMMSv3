import React from 'react';
import { Platform } from 'react-native';
import AdminBottomTabNavigator from './AdminBottomTabNavigator';
import AdminStackNavigator from './AdminStackNavigator';

export default function AdminNavigator() {
  // Use stack with menu for web, bottom tabs for mobile
  if (Platform.OS === 'web') {
    return <AdminStackNavigator />;
  } else {
    return <AdminBottomTabNavigator />;
  }
}