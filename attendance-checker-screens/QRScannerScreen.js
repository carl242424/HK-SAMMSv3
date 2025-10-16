import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import QRCheckIn from "./QRCheckIn"; // Make sure this path is correct

const API_URL = "http://192.168.86.139:8000/api/checkerAttendance";
const PRIMARY_COLOR = "#00A4DF";

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarcodeScanned = async ({ data }) => {
    console.log("Raw QR data:", data); // Debug raw QR data
    try {
      const parsed = JSON.parse(data); // Expects structured JSON from QR
      setScannedData(parsed);
      setIsSaving(true);

      // Prepare check record with checker details
      const checkRecord = {
        studentId: parsed.studentId || `NO-ID-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        studentName: parsed.studentName || "N/A",
        checkerId: "FAC001", // Example checker ID (replace with dynamic value if needed)
        checkerName: "John Facilitator", // Example checker name (replace with dynamic value if needed)
        checkInTime: new Date(),
        location: parsed.location || "Room 101",
        status: "Pending",
      };

      // Save attendance to backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkRecord),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("✅ Attendance Recorded", `${checkRecord.studentName} marked for check.`);
      } else {
        Alert.alert("❌ Failed", result.message || "Something went wrong");
      }

      setIsSaving(false);
    } catch (error) {
      console.log("QR parse error:", error);
      Alert.alert("⚠️ Invalid QR", "This QR code is not valid or unreadable.");
      setIsSaving(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>We need your camera permission.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={{ color: "white" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
      >
        <View style={styles.overlay}>
          <Text style={styles.scanText}>Scan Scholar Duty QR</Text>
        </View>
      </CameraView>

      {isSaving && (
        <View style={styles.overlayCenter}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={{ color: PRIMARY_COLOR, marginTop: 10 }}>Saving...</Text>
        </View>
      )}

      {scannedData && !isSaving && (
        <>
          <QRCheckIn scannedData={scannedData} />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: PRIMARY_COLOR, marginTop: 15, marginHorizontal: 15 }]}
            onPress={() => setScannedData(null)}
          >
            <Text style={{ color: "white" }}>Scan Again</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  overlayCenter: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scanText: {
    color: "white",
    fontSize: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});