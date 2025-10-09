import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CheckerProfile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checker Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Student Name:</Text>
        <Text style={styles.value}>John Doe</Text>

        <Text style={styles.label}>Student ID:</Text>
        <Text style={styles.value}>2025-001</Text>

        <Text style={styles.label}>Year:</Text>
        <Text style={styles.value}>3rd Year</Text>

        <Text style={styles.label}>Course:</Text>
        <Text style={styles.value}>BS Information Technology</Text>

        <Text style={styles.label}>Duty Type:</Text>
        <Text style={styles.value}>Attendance Checker</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  value: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckerProfile;
