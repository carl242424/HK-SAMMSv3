import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const QRCheckIn = ({ scannedData }) => {
  if (!scannedData) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>QR Check-In Data</Text>

      <View style={styles.row}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{scannedData.id || "N/A"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{scannedData.name || "N/A"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Duty:</Text>
        <Text style={styles.value}>{scannedData.dutyType || "N/A"}</Text>
      </View>

      <View style={styles.schedules}>
        <Text style={[styles.label, { marginBottom: 5 }]}>Schedules:</Text>
        {scannedData.schedules && scannedData.schedules.length > 0 ? (
          scannedData.schedules.map((schedule, index) => (
            <View key={index} style={styles.scheduleRow}>
              <Text>{schedule.day}</Text>
              <Text>
                {schedule.startTime} - {schedule.endTime}
              </Text>
              {schedule.room && <Text>Room: {schedule.room}</Text>}
            </View>
          ))
        ) : (
          <Text>No schedules available</Text>
        )}
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{scannedData.status || "N/A"}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    width: 80,
  },
  value: {
    flex: 1,
  },
  schedules: {
    marginTop: 10,
    marginBottom: 10,
  },
  scheduleRow: {
    marginBottom: 6,
  },
});

export default QRCheckIn;
