import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";

export default function ScholarDutyQR({ duty, onRemove }) {
  const [status, setStatus] = useState("Active");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  // ✅ Auto-expire for Attendance Checker
  useEffect(() => {
    if (duty.duty === "Attendance Checker" && duty.schedules?.length > 0) {
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

  // ✅ Generate unique hash-based QR content
  const generateUniqueCode = async () => {
    const rawData = `${duty.id}-${duty.name}-${duty.duty}-${Date.now()}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawData
    );
    return hash.substring(0, 12).toUpperCase();
  };

  useEffect(() => {
    (async () => {
      const code = await generateUniqueCode();

      // Embed both the code and all duty details in the QR content
      const qrPayload = {
        qrCode: code,
        id: duty.id,
        name: duty.name,
        year: duty.year,
        course: duty.course,
        dutyType: duty.duty,
        schedules: duty.schedules,
        status,
        generatedAt: new Date().toISOString(),
      };

      setQrCodeValue(JSON.stringify(qrPayload));
    })();
  }, [duty, status]);

  const isSmallScreen = width < 400;

  return (
    <>
      {/* Main Card */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.qrContainer}>
            <QRCode value={qrCodeValue || "Generating..."} size={120} />
          </View>
        </TouchableOpacity>

        <View style={styles.details}>
          <View
            style={[
              styles.headerRow,
              isSmallScreen && {
                flexDirection: "column",
                alignItems: "flex-start",
              },
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

          <Text
            style={[
              styles.status,
              { color: status === "Active" ? "green" : "red" },
            ]}
          >
            Status: {status}
          </Text>

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

      {/* Modal for QR Popup */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <QRCode value={qrCodeValue || "Generating..."} size={250} />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
