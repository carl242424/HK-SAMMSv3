import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ACDashboard = () => {
  const stats = [
    {
      title: "Today's Checks",
      value: '100',
      subtitle: 'student faci encoded',
    },
    {
      title: 'Current Shift',
      value: '1hr 2m',
      subtitle: 'Remaining',
    },
    {
      title: 'This Week',
      value: '100 Hours',
      subtitle: 'Completed',
    },
  ];

  const schedule = [
    {
      date: 'Wed Oct 8 2025',
      time: '7:30am - 9:30am',
    },
    {
      date: 'Wed Oct 15 2025',
      time: '7:30am - 9:30am',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{stat.title}</Text>
            <Text style={styles.cardValue}>{stat.value}</Text>
            <Text style={styles.cardSubtitle}>{stat.subtitle}</Text>
          </View>
        ))}
      </View>

      {/* Schedule */}
      <View style={styles.scheduleSection}>
        <Text style={styles.scheduleTitle}>Today's Schedule</Text>
        <View style={styles.scheduleBox}>
          {schedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleDate}>{item.date}</Text>
              <Text style={styles.scheduleTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    width: '30%',
    marginBottom: 15,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  scheduleSection: {
    marginTop: 10,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  scheduleBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  scheduleItem: {
    marginBottom: 10,
  },
  scheduleDate: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#333',
  },
});

export default ACDashboard;
