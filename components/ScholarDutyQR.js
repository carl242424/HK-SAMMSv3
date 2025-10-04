import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";

export default function ScholarDutyQR({ duty, onRemove }) {
  const [status, setStatus] = useState("Active");
  const { width } = useWindowDimensions(); // ✅ detect screen size

  // ✅ Auto-expire for Attendance Checker
  useEffect(() => {
    if (
      duty.duty === "Attendance Checker" &&
      duty.schedules &&
      duty.schedules.length > 0
    ) {
      const checkExpiry = () => {
        const now = new Date();
        let expired = false;

        duty.schedules.forEach((s) => {
          const end = new Date();
          if (!s.endTime) return;

          const [time, modifier] = s.endTime.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (modifier === "PM" && hours !== 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;

          end.setHours(hours, minutes);
          end.setMinutes(end.getMinutes() + 60);
          if (now > end) expired = true;
        });

        setStatus(expired ? "Expired" : "Active");
      };

      checkExpiry();
      const timer = setInterval(checkExpiry, 60000);
      return () => clearInterval(timer);
    }
  }, [duty]);

  // ✅ QR data
  const qrData = JSON.stringify({
    id: duty.id,
    name: duty.name,
    year: duty.year,
    course: duty.course,
    dutyType: duty.duty,
    schedules: duty.schedules,
    status,
  });

  const isSmallScreen = width < 400; // breakpoint for mobile

  return (
    <View style={styles.card}>
      <View style={styles.qrContainer}>
        <QRCode value={qrData} size={120} />
      </View>

      <View style={styles.details}>
        {/* Duty Info */}
        <View
          style={[
            styles.headerRow,
            isSmallScreen && { flexDirection: "column", alignItems: "flex-start" },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{duty.duty}</Text>
            <Text style={styles.subtext}>
              {duty.name} ({duty.id})
            </Text>
            <Text>
              {duty.year} • {duty.course}
            </Text>
          </View>

          {/* Remove button for larger screens */}
          {!isSmallScreen && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove && onRemove(duty.id)}
            >
              <Ionicons name="trash-outline" size={18} color="white" />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Schedules */}
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleHeader}>Schedules:</Text>
          {duty.schedules.map((s, i) => (
            <View key={i} style={styles.scheduleItem}>
              <Text>
                {s.day} — {s.startTime} - {s.endTime}
              </Text>
              {s.room ? (
                <Text style={styles.roomText}>Room: {s.room}</Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Status */}
        <Text
          style={[
            styles.status,
            { color: status === "Active" ? "green" : "red" },
          ]}
        >
          Status: {status}
        </Text>

        {/* Remove button for mobile (below Status) */}
        {isSmallScreen && (
          <TouchableOpacity
            style={[styles.removeButton, { alignSelf: "flex-start", marginTop: 8 }]}
            onPress={() => onRemove && onRemove(duty.id)}
          >
            <Ionicons name="trash-outline" size={18} color="white" />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  qrContainer: {
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  subtext: { fontSize: 13, color: "#444", marginBottom: 4 },
  scheduleContainer: { marginTop: 8 },
  scheduleHeader: { fontWeight: "600", marginBottom: 4 },
  scheduleItem: { marginBottom: 4 },
  roomText: { fontWeight: "500", color: "#333" },
  status: { marginTop: 8, fontWeight: "600" },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4d4d",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 5,
  },
});
