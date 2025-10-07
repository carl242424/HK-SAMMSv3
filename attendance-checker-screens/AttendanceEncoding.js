import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Crypto from "expo-crypto";

const AttendanceEncoding = () => {
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [room, setRoom] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [classStatus, setClassStatus] = useState("With Class");
  const [facilitatorStatus, setFacilitatorStatus] = useState("With Facilitator");
  const [qrValue, setQrValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ Generate unique hashed QR content
  const generateQRCode = async (data) => {
    const rawData = `${data.studentID}-${data.studentName}-${Date.now()}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawData
    );

    const qrPayload = {
      qrCode: hash.substring(0, 12).toUpperCase(),
      ...data,
      generatedAt: new Date().toLocaleString(),
    };

    setQrValue(JSON.stringify(qrPayload));
    setModalVisible(true);
  };

  // ✅ Handle Save Attendance Record
  const handleSave = async () => {
    if (!studentName || !studentID || !room || !year || !section) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    const attendanceData = {
      studentName,
      studentID,
      room,
      year,
      section,
      classStatus,
      facilitatorStatus,
      date: new Date().toLocaleString(),
    };

    // Here you could insert data into your DB (Attendance Record table)
    // Example: await saveAttendanceToDB(attendanceData);

    await generateQRCode(attendanceData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Attendance Form</Text>

      {/* Input Fields */}
      <TextInput
        placeholder="Student Name"
        style={styles.input}
        value={studentName}
        onChangeText={setStudentName}
      />
      <TextInput
        placeholder="Student ID"
        style={styles.input}
        value={studentID}
        onChangeText={setStudentID}
      />
      <TextInput
        placeholder="Room"
        style={styles.input}
        value={room}
        onChangeText={setRoom}
      />
      <TextInput
        placeholder="Year"
        style={styles.input}
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        placeholder="Section"
        style={styles.input}
        value={section}
        onChangeText={setSection}
      />

      {/* Class Status */}
      <Text style={styles.label}>Class Status:</Text>
      <View style={styles.radioGroup}>
        {["With Class", "No Class"].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioButton}
            onPress={() => setClassStatus(option)}
          >
            <View
              style={[
                styles.radioCircle,
                classStatus === option && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Facilitator Status */}
      <Text style={styles.label}>Facilitator Status:</Text>
      <View style={styles.radioGroup}>
        {["With Facilitator", "No Facilitator"].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioButton}
            onPress={() => setFacilitatorStatus(option)}
          >
            <View
              style={[
                styles.radioCircle,
                facilitatorStatus === option && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Attendance Record</Text>
      </TouchableOpacity>

      {/* QR Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <QRCode value={qrValue || "Generating..."} size={250} />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#212d61",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 5,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#212d61",
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: "#212d61",
  },
  radioText: {
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#212d61",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AttendanceEncoding;
