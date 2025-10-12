import React from 'react';
import { Platform } from 'react-native';
import StudentFaciBottomNavigator from './StudentFaciBottomNavigator';
import StudentFaciStackNavigator from './StudentFaciStackNavigator';

export default function StudentFaciNavigator() {
  // Use stack navigation for web, bottom tabs for mobile
  if (Platform.OS === 'web') {
    return <StudentFaciStackNavigator />;
  } else {
    return <StudentFaciBottomNavigator />;
  }
}