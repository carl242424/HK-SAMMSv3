// navigations/StudentFaciStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentFaciHeader from '../student-facilitator-components/StudentFaciHeader';

import SFDashboard from '../student-facilitator-screens/SFDashboard';
import StudentFaciProfile from '../student-facilitator-screens/StudentFaciProfile';
import QRCheckIn from '../student-facilitator-screens/QRCheckIn';
import AttendancePhoto from '../student-facilitator-screens/AttendancePhoto';
import QRScannerScreen from '../student-facilitator-screens/QRScannerScreen';

const Stack = createNativeStackNavigator();

export default function StudentFaciStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SFDashboard"
      screenOptions={{
        headerStyle: { backgroundColor: '#60a5fa' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="SFDashboard"
        component={SFDashboard}
        options={{
          title: 'Dashboard',
          headerLeft: () => <StudentFaciHeader />,
        }}
      />
      <Stack.Screen
        name="QRCheckIn"
        component={QRCheckIn}
        options={{
          title: 'QR Check-In',
          headerLeft: () => <StudentFaciHeader />,
        }}
      />
      <Stack.Screen
        name="SelfAttendance"
        component={AttendancePhoto}
        options={{
          title: 'Self Attendance',
          headerLeft: () => <StudentFaciHeader />,
        }}
      />
      <Stack.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{
          title: 'QR Scanner',
          headerLeft: () => <StudentFaciHeader />,
        }}
      />
      <Stack.Screen
        name="MyProfile"
        component={StudentFaciProfile}
        options={{
          title: 'My Profile',
          headerLeft: () => <StudentFaciHeader />,
        }}
      />
    </Stack.Navigator>
  );
}