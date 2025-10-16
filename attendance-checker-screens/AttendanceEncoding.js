import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

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

const API_URL = "http://192.168.86.139:8000/api/attendance"; // Update to match your backend port

const AttendanceEncoding = () => {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [yearLevel, setYearLevel] = useState(null);
  const [course, setCourse] = useState(null);
  const [dutyType, setDutyType] = useState(null);
  const [room, setRoom] = useState(null);
  const [records, setRecords] = useState([]);
  const [lastRecord, setLastRecord] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [classStatus, setClassStatus] = useState(null);
  const [facilitatorStatus, setFacilitatorStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch records on mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // Fetch records from backend
  const fetchRecords = async (query = "") => {
    try {
      const url = query ? `${API_URL}/search?query=${encodeURIComponent(query)}` : API_URL;
      const response = await axios.get(url);
      const formattedRecords = response.data.map(record => ({
        ...record,
        id: record._id,
      }));
      setRecords(formattedRecords);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch records. Please try again.");
      console.error(error);
    }
  };

  // Auto-fill form when studentId changes
  useEffect(() => {
    if (studentId && studentId.match(/^\d{2}-\d{4}-\d{6}$/)) {
      fetchStudentData(studentId);
    } else {
      // Clear fields if studentId is invalid
      setStudentName("");
      setYearLevel(null);
      setCourse(null);
      setDutyType(null);
    }
  }, [studentId]);

  // Fetch student data for auto-fill
  const fetchStudentData = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/student/${id}`);
      const record = response.data;
      setStudentName(record.studentName || "");
      setYearLevel(record.yearLevel || null);
      setCourse(record.course || null);
      setDutyType(record.dutyType || null);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No record found, keep fields empty
        setStudentName("");
        setYearLevel(null);
        setCourse(null);
        setDutyType(null);
      } else {
        Alert.alert("Error", "Failed to fetch student data. Please try again.");
        console.error(error);
      }
    }
  };

  // Handle save with duplicate and 40-minute checks
  const handleSave = async () => {
    try {
      const idPattern = /^\d{2}-\d{4}-\d{6}$/;
      const trimmedName = studentName?.trim();
      if (!trimmedName || !studentId || !yearLevel || !course || !dutyType || !room) {
        Alert.alert("Error", "Please fill out all fields.");
        return;
      }

      if (!idPattern.test(studentId)) {
        Alert.alert("Invalid Format", "Student ID must follow 00-0000-000000 format (2-4-6 digits).");
        return;
      }

      const newRecord = {
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

      // Send record to backend
      const response = await axios.post(API_URL, newRecord);
      const savedRecord = { ...response.data, id: response.data._id };
      setRecords((prev) => [...prev, savedRecord]);
      setLastRecord(savedRecord);
      setQrModalVisible(true);
      setFormModalVisible(false);

      // Reset form
      setStudentName("");
      setStudentId("");
      setYearLevel(null);
      setCourse(null);
      setDutyType(null);
      setRoom(null);
      setClassStatus(null);
      setFacilitatorStatus(null);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error) {
        Alert.alert("Error", error.response.data.error); // Show backend error (e.g., duplicate check-in)
      } else {
        Alert.alert("Error", "Failed to save record. Please try again.");
      }
      console.error(error);
    }
  };

  // Update search
  useEffect(() => {
    fetchRecords(searchQuery);
  }, [searchQuery]);

  const formatStudentId = (text) => {
    const digits = text.replace(/[^\d]/g, "");
    if (digits.length > 12) return studentId;
    let formatted = "";
    if (digits.length > 0) formatted = digits.substring(0, 2);
    if (digits.length > 2) formatted += "-" + digits.substring(2, 6);
    if (digits.length > 6) formatted += "-" + digits.substring(6, 12);
    return formatted;
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header row: Title + Button inline */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Attendance Encoding</Text>
        <TouchableOpacity
          style={styles.openFormButton}
          onPress={() => setFormModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.openFormButtonText}>Open Attendance Form</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#777" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* Table displayed below */}
      <SaveAttendanceRecordTable records={records} />

      {/* Attendance Form Modal */}
      <Modal
        visible={formModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFormModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalFormContent}>
            <Text style={styles.formTitle}>Attendance Form</Text>

            <ScrollView style={{ width: "100%" }} keyboardShouldPersistTaps="handled">
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
                  placeholder="00-0000-000000"
                  placeholderTextColor="#888"
                  value={studentId}
                  onChangeText={(text) => setStudentId(formatStudentId(text))}
                  keyboardType="numeric"
                  maxLength={14}
                />
              </View>

              <Dropdown
                style={styles.dropdown}
                data={YEARS.map((item) => ({ label: item, value: item }))}
                labelField="label"
                valueField="value"
                placeholder="Select Year Level"
                value={yearLevel}
                onChange={(item) => setYearLevel(item.value)}
              />

              <Dropdown
                style={styles.dropdown}
                data={COURSES.map((item) => ({ label: item, value: item }))}
                labelField="label"
                valueField="value"
                placeholder="Select Course"
                value={course}
                onChange={(item) => setCourse(item.value)}
              />

              <Dropdown
                style={styles.dropdown}
                data={DUTY_TYPES.map((item) => ({ label: item, value: item }))}
                labelField="label"
                valueField="value"
                placeholder="Select Duty Type"
                value={dutyType}
                onChange={(item) => setDutyType(item.value)}
              />

              <Dropdown
                style={styles.dropdown}
                data={ROOMS.map((item) => ({ label: item, value: item }))}
                labelField="label"
                valueField="value"
                placeholder="Select Room"
                value={room}
                onChange={(item) => setRoom(item.value)}
              />

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

              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Attendance Record</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setFormModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close Form</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* QR Modal */}
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalQRContent}>
            <Text style={styles.modalTitle}>Attendance QR Code</Text>
            {lastRecord ? (
              <QRCode value={JSON.stringify(lastRecord)} size={200} />
            ) : (
              <Text>No record to display.</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setQrModalVisible(false)}
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
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  openFormButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  openFormButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalFormContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "90%",
  },
  modalQRContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  inputContainer: { marginBottom: 10 },
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
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  closeModalButton: {
    marginTop: 15,
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 5,
  },
  radioOption: { flexDirection: "row", alignItems: "center" },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 6,
  },
  radioSelected: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  radioText: { color: "#333", fontSize: 15 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
});

export default AttendanceEncoding;