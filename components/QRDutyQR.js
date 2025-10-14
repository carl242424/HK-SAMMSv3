import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";

export default function QRDutyQR({ duty, onRemove }) {
  const [status, setStatus] = useState(duty.status || "Active");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  console.log("Screen width:", width);

  useEffect(() => {
    if (duty.duty === "Attendance Checker" && duty.schedules?.length > 0) {
      const checkExpiry = () => {
        const now = new Date();
        let expired = false;

        duty.schedules.forEach((s) => {
          if (!s.endTime) return;

          const [time, modifier] = s.endTime.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (modifier === "PM" && hours !== 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;

          const end = new Date();
          end.setHours(hours, minutes, 0, 0);
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

      const qrPayload = {
        qrCode: code,
        id: duty.id,
        name: duty.name,
        year: duty.year,
        course: duty.course,
        dutyType: duty.duty,
        schedules: duty.schedules,
        status,
        generatedAt: "2025-10-14T20:29:00-07:00", // 08:29 PM PST, October 14, 2025
      };

      setQrCodeValue(JSON.stringify(qrPayload));
    })();
  }, [duty, status]);

  const handleRemove = () => {
    console.log("Remove button pressed for duty:", JSON.stringify(duty, null, 2));
    const key = duty.recordId;

    if (!key) {
      console.error("Error: Duty has no recordId:", duty);
      Alert.alert("Error", "This duty cannot be removed because it has no record ID.");
      return;
    }

    console.log("Calling onRemove with key:", key);
    onRemove?.(key);
  };

  const isSmallScreen = width < 400;

  return (
    <>
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
              <Text style={styles.title}>{duty.duty || "Unknown Duty"}</Text>
              <Text style={styles.subtext}>
                {duty.name || "N/A"} ({duty.id || "N/A"})
              </Text>
              <Text>
                {duty.year || "N/A"} • {duty.course || "N/A"}
              </Text>
            </View>

            {!isSmallScreen && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  console.log("Large screen Remove button pressed");
                  handleRemove();
                }}
              >
                <Ionicons name="trash-outline" size={18} color="white" />
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleHeader}>Schedules:</Text>
            {duty.schedules?.length > 0 ? (
              duty.schedules.map((s, i) => (
                <View key={i} style={styles.scheduleItem}>
                  <Text>
                    {s.day || "N/A"} — {s.startTime || "N/A"} -{" "}
                    {s.endTime || "N/A"}
                  </Text>
                  {s.room ? (
                    <Text style={styles.roomText}>Room: {s.room}</Text>
                  ) : null}
                </View>
              ))
            ) : (
              <Text style={styles.roomText}>No schedules assigned</Text>
            )}
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
              onPress={() => {
                console.log("Small screen Remove button pressed");
                handleRemove();
              }}
            >
              <Ionicons name="trash-outline" size={18} color="white" />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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
    zIndex: 10,
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