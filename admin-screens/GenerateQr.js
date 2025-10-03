import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ManageAccounts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Generate Qr Code</Text>
      <Text style={styles.subheader}>
        This is where Admin users will generate qr codes for the attendance checker.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ManageAccounts;
