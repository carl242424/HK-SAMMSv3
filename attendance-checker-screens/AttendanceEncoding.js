import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import QRCode from "react-native-qrcode-svg";
import moment from "moment";
import SaveAttendanceRecordTable from "./SaveAttendanceRecordTable";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const COURSES = [
  "BS ACCOUNTANCY",
  "BS HOSPITALITY MANAGEMENT",
  "BS TOURISM MANAGEMENT",
  "BSBA- MARKETING MANAGEMENT",
  "BSBA- BANKING & MICROFINANCE",
  "BACHELOR OF ELEMENTARY EDUCATION",
  "BSED- ENGLISH",
  "BSED- FILIPINO",
  "BS CRIMINOLOGY",
  "BS CIVIL ENGINEERING",
  "BS INFORMATION TECHNOLOGY",
  "BS NURSING",
];
const DUTY_TYPES = ["Student Facilitator"];
const ROOMS = [
  "201", "202", "CL1", "CL2", "208", "209",
  "301", "302", "304", "305", "307", "308", "309",
  "401", "402", "403", "404", "405", "CL3", "CL4",
  "408", "409",
];

const AttendanceForm = () => {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [yearLevel, setYearLevel] = useState(null);
  const [course, setCourse] = useState(null);
  const [dutyType, setDutyType] = useState(null);
  const [room, setRoom] = useState(null);
  const [records, setRecords] = useState([]);
  const [lastRecord, setLastRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [classStatus, setClassStatus] = useState(null);
  const [facilitatorStatus, setFacilitatorStatus] = useState(null);

  const handleSave = () => {
    console.log("✅ Save button pressed");
    try {
      const idPattern = /^\d{2}-\d{4}-\d{6}$/;
      const trimmedName = studentName?.trim();
      if (!trimmedName || !studentId || !yearLevel || !course || !dutyType || !room) {
        const errorMsg = "Please fill out all fields.";
        Alert.alert("Error", errorMsg);
        console.warn("❌ Validation failed - Required fields missing:", errorMsg);
        return;
      }

      if (!idPattern.test(studentId)) {
        const parts = studentId.split("-");
        const errorDetails = {
          studentId,
          isValid: idPattern.test(studentId),
          parts: parts.length === 3
            ? {
                first: parts[0]?.length || 0,
                middle: parts[1]?.length || 0,
                last: parts[2]?.length || 0,
              }
            : { invalidFormat: true },
        };
        const errorMsg = "Student ID must follow 00-0000-000000 format (2-4-6 digits).";
        Alert.alert("Invalid Format", errorMsg);
        console.warn("❌ ID validation failed:", errorDetails);
        return;
      }

      const newRecord = {
        id: Date.now().toString(),
        studentName: trimmedName,
        studentId,
        yearLevel,
        course,
        dutyType,
        room,
        classStatus,
        facilitatorStatus,
        encodedTime: moment().format("MM/DD/YYYY hh:mm A"),
      };

      console.log("📦 Record created:", newRecord);

      setRecords((prev) => [...prev, newRecord]);
      setLastRecord(newRecord);
      setModalVisible(true);

      setStudentName("");
      setStudentId("");
      setYearLevel(null);
      setCourse(null);
      setDutyType(null);
      setRoom(null);
      setClassStatus(null);
      setFacilitatorStatus(null);

      console.log("✅ Record saved and QR modal opened");
    } catch (error) {
      console.error("❌ Save error:", error);
      Alert.alert("Error", "Failed to save record. Check console for details.");
    }
  };

  const formatStudentId = (text) => {
    const digits = text.replace(/[^\d]/g, "");
    if (digits.length > 12) return studentId;
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.substring(0, 2);
    }
    if (digits.length > 2) {
      formatted += "-" + digits.substring(2, 6);
    }
    if (digits.length > 6) {
      formatted += "-" + digits.substring(6, 12);
    }
    return formatted;
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Attendance Encoding</Text>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Attendance Form</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Student Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Student Name"
            placeholderTextColor="#888"
            value={studentName}
            onChangeText={setStudentName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Student ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Student ID (00-0000-000000)"
            placeholderTextColor="#888"
            value={studentId}
            onChangeText={(text) => setStudentId(formatStudentId(text))}
            keyboardType="numeric"
            maxLength={14}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={{ zIndex: 10 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Year Level</Text>
            <Dropdown
              style={[styles.dropdown, { zIndex: 10 }]}
              containerStyle={{ zIndex: 10 }}
              data={YEARS.map((item) => ({ label: item, value: item }))}
              labelField="label"
              valueField="value"
              placeholder="Select Year Level"
              placeholderStyle={styles.placeholder}
              value={yearLevel}
              onChange={(item) => setYearLevel(item.value)}
            />
          </View>
        </View>

        <View style={{ zIndex: 9 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Course</Text>
            <Dropdown
              style={[styles.dropdown, { zIndex: 9 }]}
              containerStyle={{ zIndex: 9 }}
              data={COURSES.map((item) => ({ label: item, value: item }))}
              labelField="label"
              valueField="value"
              placeholder="Select Course"
              placeholderStyle={styles.placeholder}
              value={course}
              onChange={(item) => setCourse(item.value)}
            />
          </View>
        </View>

        <View style={{ zIndex: 8 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duty Type</Text>
            <Dropdown
              style={[styles.dropdown, { zIndex: 8 }]}
              containerStyle={{ zIndex: 8 }}
              data={DUTY_TYPES.map((item) => ({ label: item, value: item }))}
              labelField="label"
              valueField="value"
              placeholder="Select Duty Type"
              placeholderStyle={styles.placeholder}
              value={dutyType}
              onChange={(item) => setDutyType(item.value)}
            />
          </View>
        </View>

        <View style={{ zIndex: 7 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Room</Text>
            <Dropdown
              style={[styles.dropdown, { zIndex: 7 }]}
              containerStyle={{ zIndex: 7 }}
              data={ROOMS.map((item) => ({ label: item, value: item }))}
              labelField="label"
              valueField="value"
              placeholder="Select Room"
              placeholderStyle={styles.placeholder}
              value={room}
              onChange={(item) => setRoom(item.value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Class Status</Text>
          <View style={styles.radioGroup}>
            {["With Class", "No Class"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOption}
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
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Facilitator Status</Text>
          <View style={styles.radioGroup}>
            {["With Facilitator", "No Facilitator"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOption}
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
        </View>

        <View style={{ zIndex: 100 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Save Attendance Record</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SaveAttendanceRecordTable records={records} />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Attendance QR Code</Text>
            {lastRecord ? (
              <QRCode value={JSON.stringify(lastRecord)} size={200} />
            ) : (
              <Text style={{ color: "#888", marginBottom: 20 }}>
                No record to display.
              </Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f4f7",
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 30,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    width: "95%",
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    zIndex: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#000",
  },
  placeholder: {
    color: "#888",
    fontSize: 14,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 15,
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  radioText: {
    color: "#333",
    fontSize: 15,
    marginRight: 10,
  },
});

export default AttendanceForm;
