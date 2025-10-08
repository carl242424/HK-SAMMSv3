import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your Attendance Checker screens
import ACDashboard from '../attendance-checker-screens/ACDashboard';
import AttendanceEncoding from '../attendance-checker-screens/AttendanceEncoding';
import CheckerProfile from '../attendance-checker-screens/CheckerProfile';
import QRCheckIn from '../attendance-checker-screens/QRCheckIn';
import QRScannerScreen from '../attendance-checker-screens/QRScannerScreen';

const Tab = createBottomTabNavigator();

export default function AttendanceCheckerBottomNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="ACDashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#60a5fa', // Blue
        tabBarInactiveTintColor: '#6b7280', // Gray
        tabBarStyle: { height: 60, paddingBottom: 5 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ACDashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Encoding') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'My Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'QR Check-In') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'QR Scanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ACDashboard" component={ACDashboard} />
      <Tab.Screen name="Encoding" component={AttendanceEncoding} />
      <Tab.Screen name="My Profile" component={CheckerProfile} />
      <Tab.Screen name="QR Check-In" component={QRCheckIn} />
      <Tab.Screen name="QR Scanner" component={QRScannerScreen} />
    </Tab.Navigator>
  );
}
