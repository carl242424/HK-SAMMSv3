import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment'; // For date/time calculations

const ACDashboard = () => {
  const [stats, setStats] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with actual studentId from your app's auth context
  // const studentId = '12345'; // Example: Uncomment and set dynamically

  // Helper function to parse duty time (e.g., "8:30-10:00" or "8:30AM-10:00AM")
  const parseDutyTime = (timeStr, date) => {
    const [start, end] = timeStr.split('-').map((t) => t.trim());
    const startTime = moment(`${date} ${start}`, 'YYYY-MM-DD h:mmA');
    const endTime = moment(`${date} ${end}`, 'YYYY-MM-DD h:mmA');
    if (!startTime.isValid() || !endTime.isValid()) {
      console.error(`Invalid time format: ${timeStr} for date ${date}`);
      return { startTime: null, endTime: null };
    }
    return { startTime, endTime };
  };

  // Helper function to calculate hours between two times
  const calculateHours = (start, end) => {
    if (!moment(start).isValid() || !moment(end).isValid()) {
      console.warn(`Invalid start or end time: ${start}, ${end}`);
      return 0;
    }
    return moment(end).diff(moment(start), 'hours', true);
  };

  // Helper function to get remaining shift time
  const getRemainingShift = (startTime, endTime, currentTime) => {
    if (!moment(startTime).isValid() || !moment(endTime).isValid()) {
      console.warn(`Invalid shift times: start=${startTime}, end=${endTime}`);
      return 'Invalid Shift';
    }
    const now = moment(currentTime);
    const end = moment(endTime);
    if (now.isBefore(end)) {
      const remainingMinutes = end.diff(now, 'minutes');
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;
      return `${hours}hr ${minutes}m`;
    }
    return 'Shift Ended';
  };

  // Helper function to get the date for a specific day in the current week
  const getDateForDay = (dayName) => {
    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const targetDay = dayMap[dayName];
    if (targetDay === undefined) {
      console.error(`Invalid day name: ${dayName}`);
      return moment().format('YYYY-MM-DD');
    }
    return moment().day(targetDay).format('YYYY-MM-DD');
  };

  // Fetch data and compute stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from your API
        // const dutiesUrl = studentId
        //   ? `http://192.168.86.139:8000/api/duties?id=${studentId}`
        //   : 'http://192.168.86.139:8000/api/duties';
        // const attendanceUrl = studentId
        //   ? `http://192.168.86.139:8000/api/checkerAttendance?studentId=${studentId}`
        //   : 'http://192.168.86.139:8000/api/checkerAttendance';
        const dutiesUrl = 'http://192.168.86.39:8000/api/duties';
        const attendanceUrl = 'http://192.168.86.39:8000/api/attendance';

        console.log('Fetching duties from:', dutiesUrl);
        console.log('Fetching attendance from:', attendanceUrl);

        const dutiesResponse = await fetch(dutiesUrl);
        const attendanceResponse = await fetch(attendanceUrl);

        if (!dutiesResponse.ok) {
          throw new Error(`Duties API error: ${dutiesResponse.status} ${dutiesResponse.statusText}`);
        }
        if (!attendanceResponse.ok) {
          throw new Error(`Attendance API error: ${attendanceResponse.status} ${attendanceResponse.statusText}`);
        }

        const duties = await dutiesResponse.json();
        const attendance = await attendanceResponse.json();

        console.log('Duties received:', duties);
        console.log('Attendance received:', attendance);

        const today = moment().format('YYYY-MM-DD');
        const todayDayName = moment().format('dddd'); // e.g., "Tuesday"
        const startOfWeek = moment().startOf('week').format('YYYY-MM-DD'); // Sunday
        const endOfWeek = moment().endOf('week').format('YYYY-MM-DD'); // Saturday

        console.log('Today:', today, 'Day:', todayDayName);
        console.log('Week range:', startOfWeek, 'to', endOfWeek);

        // 1. Today's Schedule
        const todaySchedule = duties
          .filter((duty) => {
            const isMatch = duty.day === todayDayName && duty.status === 'Active';
            console.log(`Checking duty: ${duty.time}, Day: ${duty.day}, Status: ${duty.status}, Match: ${isMatch}`);
            return isMatch;
          })
          .map((duty) => ({
            date: moment(today).format('ddd MMM D YYYY'),
            time: duty.time,
          }));

        console.log('Today\'s schedule:', todaySchedule);

        // 2. Today's Checks
        const todayChecks = attendance.filter((att) => {
          const isToday = moment(att.checkInTime).isSame(today, 'day');
          console.log(`Checking attendance: ${att.checkInTime}, Is today: ${isToday}`);
          return isToday;
        }).length;

        console.log('Today\'s checks:', todayChecks);

        // 3. Current Shift
        let currentShift = 'No Active Shift';
        const currentTime = moment();
        const activeDuty = duties.find((duty) => {
          if (duty.day !== todayDayName || duty.status !== 'Active') return false;
          const { startTime, endTime } = parseDutyTime(duty.time, today);
          if (!startTime || !endTime) return false;
          const isActive = currentTime.isBetween(startTime, endTime, null, '[]');
          console.log(`Checking shift: ${duty.time}, Active: ${isActive}`);
          return isActive;
        });
        if (activeDuty) {
          const { endTime } = parseDutyTime(activeDuty.time, today);
          currentShift = getRemainingShift(currentTime, endTime, currentTime);
        }

        console.log('Current shift:', currentShift);

        // 4. This Week's Hours
        const weekAttendance = attendance.filter((att) => {
          const isInWeek = moment(att.checkInTime).isBetween(startOfWeek, endOfWeek, null, '[]');
          console.log(`Checking week attendance: ${att.checkInTime}, In week: ${isInWeek}`);
          return isInWeek;
        });
        const weekHours = weekAttendance.reduce((total, att) => {
          const duty = duties.find(
            (d) =>
              d.id === att.studentId &&
              d.room === att.location &&
              d.day === moment(att.checkInTime).format('dddd') &&
              d.status === 'Active'
          );
          if (duty) {
            const { startTime, endTime } = parseDutyTime(duty.time, moment(att.checkInTime).format('YYYY-MM-DD'));
            if (startTime && endTime && moment(att.checkInTime).isBetween(startTime, endTime, null, '[]')) {
              const hours = calculateHours(startTime, endTime);
              console.log(`Matched duty for attendance ${att.checkInTime}: ${duty.time}, Hours: ${hours}`);
              return total + hours;
            }
          }
          return total;
        }, 0);

        console.log('This week\'s hours:', weekHours);

        // 5. Progress Hours
        const semesterGoal = 70;
        const totalHours = attendance.reduce((total, att) => {
          const duty = duties.find(
            (d) =>
              d.id === att.studentId &&
              d.room === att.location &&
              d.day === moment(att.checkInTime).format('dddd') &&
              d.status === 'Active'
          );
          if (duty) {
            const { startTime, endTime } = parseDutyTime(duty.time, moment(att.checkInTime).format('YYYY-MM-DD'));
            if (startTime && endTime && moment(att.checkInTime).isBetween(startTime, endTime, null, '[]')) {
              const hours = calculateHours(startTime, endTime);
              console.log(`Matched duty for progress ${att.checkInTime}: ${duty.time}, Hours: ${hours}`);
              return total + hours;
            }
          }
          return total;
        }, 0);
        const progressPercentage = Math.min((totalHours / semesterGoal) * 100, 100);

        console.log('Progress hours:', totalHours, 'Percentage:', progressPercentage);

        // Update state
        setStats([
          {
            title: "Today's Checks",
            value: todayChecks.toString(),
            subtitle: 'student faci encoded',
            icon: 'checkmark-circle-outline',
            color: '#10B981',
          },
          {
            title: 'Current Shift',
            value: currentShift,
            subtitle: 'Remaining',
            icon: 'time-outline',
            color: '#F59E0B',
          },
          {
            title: 'This Week',
            value: `${weekHours.toFixed(1)} Hours`,
            subtitle: 'Completed',
            icon: 'calendar-outline',
            color: '#3B82F6',
          },
          {
            title: 'Progress Hours',
            value: `${totalHours.toFixed(1)}/${semesterGoal} hrs`,
            subtitle: `${progressPercentage.toFixed(0)}% to semester goal`,
            icon: 'trending-up-outline',
            color: '#8B5CF6',
            progress: progressPercentage,
          },
        ]);

        setSchedule(todaySchedule);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(`Failed to load dashboard data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
          {schedule.length > 0 ? (
            schedule.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <Text style={styles.scheduleDate}>{item.date}</Text>
                <Text style={styles.scheduleTime}>{item.time}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.scheduleTime}>No schedule for today</Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
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

export default ACDashboard;