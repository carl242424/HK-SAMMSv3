// navigations/CheckerStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckerHeader from '../attendance-checker-components/CheckerHeader';

import ACDashboard from '../attendance-checker-screens/ACDashboard';
import AttendanceEncoding from '../attendance-checker-screens/AttendanceEncoding';
import CheckerProfile from '../attendance-checker-screens/CheckerProfile';
import QRCheckIn from '../attendance-checker-screens/QRCheckIn';
import QRScannerScreen from '../attendance-checker-screens/QRScannerScreen';

const Stack = createNativeStackNavigator();

export default function CheckerStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ACDashboard"
      screenOptions={{
        headerStyle: { backgroundColor: '#60a5fa' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="ACDashboard"
        component={ACDashboard}
        options={{
          title: 'Dashboard',
          headerLeft: () => <CheckerHeader />,
        }}
      />
      <Stack.Screen
        name="Encoding"
        component={AttendanceEncoding}
        options={{
          title: 'Attendance Encoding',
          headerLeft: () => <CheckerHeader />,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={CheckerProfile}
        options={{
          title: 'My Profile',
          headerLeft: () => <CheckerHeader />,
        }}
      />
      <Stack.Screen
        name="QRCheckIn"
        component={QRCheckIn}
        options={{
          title: 'QR Check-In',
          headerLeft: () => <CheckerHeader />,
        }}
      />
      <Stack.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{
          title: 'QR Scanner',
          headerLeft: () => <CheckerHeader />,
        }}
      />
    </Stack.Navigator>
  );
}
