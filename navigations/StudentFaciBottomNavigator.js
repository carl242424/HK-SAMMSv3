import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your Student Facilitator screens
import SFDashboard from '../student-facilitator-screens/SFDashboard';
import StudentFaciProfile from '../student-facilitator-screens/StudentFaciProfile';
import QRCheckIn from '../student-facilitator-screens/QRCheckIn';
import QRScannerScreen from '../student-facilitator-screens/QRScannerScreen';

const Tab = createBottomTabNavigator();

export default function StudentFaciBottomNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="SFDashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#60a5fa', // Blue
        tabBarInactiveTintColor: '#6b7280', // Gray
        tabBarStyle: { height: 60, paddingBottom: 5 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'SFDashboard') {
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
      <Tab.Screen name="SFDashboard" component={SFDashboard} />
      <Tab.Screen name="My Profile" component={StudentFaciProfile} />
      <Tab.Screen name="QR Check-In" component={QRCheckIn} />
      <Tab.Screen name="QR Scanner" component={QRScannerScreen} />
    </Tab.Navigator>
  );
}
