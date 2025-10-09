// SFDashboard.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SFDashboard = () => {
  const stats = [
    
    {
      title: 'Current Shift',
      value: '1hr 2m',
      subtitle: 'Remaining',
      icon: 'time-outline',
      color: '#F59E0B', // Orange
    },
    {
      title: 'This Week',
      value: '100 Hours',
      subtitle: 'Completed',
      icon: 'calendar-outline',
      color: '#3B82F6', // Blue
    },
    {
      title: 'Progress Hours',
      value: '35/70 hrs',
      subtitle: '50% to semester goal',
      icon: 'trending-up-outline',
      color: '#8B5CF6', // Purple
      progress: 50, // Percentage for progress bar
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
            <View style={styles.iconContainer}>
              <Ionicons name={stat.icon} size={28} color={stat.color} />
            </View>
            <Text style={styles.cardTitle}>{stat.title}</Text>
            <Text style={styles.cardValue}>{stat.value}</Text>
            <Text style={styles.cardSubtitle}>{stat.subtitle}</Text>
            {stat.progress !== undefined && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${stat.progress}%`, backgroundColor: stat.color },
                    ]}
                  />
                </View>
              </View>
            )}
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
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1E293B',
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scheduleSection: {
    marginTop: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1E293B',
  },
  scheduleBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  scheduleItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scheduleDate: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 13,
    color: '#64748B',
  },
});

export default SFDashboard;
