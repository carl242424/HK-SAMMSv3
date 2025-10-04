import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY_COLOR = "#00A4DF";

export default function ScholarCard({ scholar, onEdit, onView }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{scholar.name}</Text>
      <Text>ID: {scholar.id}</Text>
      <Text>Year: {scholar.year}</Text>
      <Text>Course: {scholar.course}</Text>
      <Text>Duty: {scholar.duty}</Text>

      <View style={styles.cardRow}>
        <Ionicons name="time-outline" size={16} color="gray" />
        <Text style={styles.small}> Duty Hours: 70 hrs</Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="target-outline" size={16} color={PRIMARY_COLOR} />
        <Text style={[styles.small, { color: PRIMARY_COLOR }]}>
          Attendance: 80%
        </Text>
      </View>

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
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12, position: "relative" },
  cardTitle: { fontWeight: "600", fontSize: 16 },
  cardRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  small: { fontSize: 12 },
  menu: { position: "absolute", right: 10, top: 10, flexDirection: "row", gap: 8 },
});
