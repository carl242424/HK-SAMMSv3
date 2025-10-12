import React from 'react';
import { Platform } from 'react-native';
import AttendanceCheckerBottomNavigator from './AttendanceCheckerBottomNavigator';
import CheckerStackNavigator from './CheckerStackNavigator';

export default function CheckerNavigator() {
  // Use stack navigation for web, bottom tabs for mobile
  if (Platform.OS === 'web') {
    return <CheckerStackNavigator />;
  } else {
    return <AttendanceCheckerBottomNavigator />;
  }
}
