import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY_COLOR = "#00A4DF";

export default function ScholarDutyCard({ duty, onEdit, onView }) {
  return (
    <View style={styles.card}>
      {/* Student Info */}
      <Text style={styles.cardTitle}>{duty.name}</Text>
      <Text>ID: {duty.id}</Text>
      <Text>Year: {duty.year}</Text>
      <Text>Course: {duty.course}</Text>
      <Text>Duty: {duty.duty}</Text>

      {/* 📅 Multiple Duty Schedules */}
      <View style={{ marginTop: 6 }}>
        <Ionicons name="calendar-outline" size={16} color="gray" />
        <Text style={[styles.small, { fontWeight: "600", marginLeft: 4 }]}>
          Assigned Schedules:
        </Text>

        {duty.schedules && duty.schedules.length > 0 ? (
          duty.schedules.map((sched, index) => (
            <Text key={index} style={[styles.small, { marginLeft: 20 }]}>
              • {sched.day}, {sched.startTime} - {sched.endTime} @ {sched.room}
            </Text>
          ))
        ) : (
          <Text style={[styles.small, { marginLeft: 20 }]}>
            No schedule assigned
          </Text>
        )}
      </View>

      {/* Duty Hours */}
      <View style={styles.cardRow}>
        <Ionicons name="time-outline" size={16} color="gray" />
        <Text style={styles.small}> Duty Hours: 70 hrs</Text>
      </View>

      {/* Attendance */}
      <View style={styles.cardRow}>
        <Ionicons name="target-outline" size={16} color={PRIMARY_COLOR} />
        <Text style={[styles.small, { color: PRIMARY_COLOR }]}>
          Attendance: 80%
        </Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onView}>
          <Ionicons name="eye-outline" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  cardTitle: { fontWeight: "600", fontSize: 16 },
  cardRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  small: { fontSize: 12 },
  menu: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "row",
    gap: 8,
  },
});
