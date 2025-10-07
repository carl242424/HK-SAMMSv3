import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HoursTracking = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hours Tracking</Text>
      <Text>This is for tracking work or attendance hours</Text>
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

export default HoursTracking;
