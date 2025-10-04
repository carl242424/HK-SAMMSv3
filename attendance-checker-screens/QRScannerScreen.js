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

const API_URL = "http://YOUR_LOCAL_IP:5000/api/attendance"; // ⚠️ replace YOUR_LOCAL_IP with your computer IP
const PRIMARY_COLOR = "#00A4DF";

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarcodeScanned = async ({ data }) => {
    try {
      const parsed = JSON.parse(data); // ✅ expects structured JSON from QR
      setScannedData(parsed);
      setIsSaving(true);

      // Save attendance to MongoDB backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("✅ Attendance Recorded", `${parsed.name} marked present.`);
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
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>📋 Scanned Data:</Text>
          <Text>ID: {scannedData.id}</Text>
          <Text>Name: {scannedData.name}</Text>
          <Text>Duty: {scannedData.dutyType}</Text>
          <Text>Day: {scannedData.day}</Text>
          <Text>Time: {scannedData.startTime} - {scannedData.endTime}</Text>
          <Text>Status: {scannedData.status}</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: PRIMARY_COLOR }]}
            onPress={() => setScannedData(null)}
          >
            <Text style={{ color: "white" }}>Scan Again</Text>
          </TouchableOpacity>
        </View>
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
  resultBox: {
    backgroundColor: "white",
    padding: 15,
  },
  resultTitle: { fontWeight: "bold", marginBottom: 5 },
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
