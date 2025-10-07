import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AttendanceEncoding = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance Encoding</Text>
      <Text>This is for Attendance Encoding</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AttendanceEncoding;
