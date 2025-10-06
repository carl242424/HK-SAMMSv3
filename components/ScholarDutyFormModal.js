import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import ConfettiCannon from "react-native-confetti-cannon"; 
import { Ionicons } from "@expo/vector-icons";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = [
  "7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM"
];
const ROOMS = [
  "201","202","CL1","CL2","208","209","301","302","304","305","307","308","309",
  "401","402","403","404","405","CL3","CL4","408","409"
];

const ScholarDutyFormModal = ({
  visible,
  onClose,
  onSave,
  initialData = null,
  YEARS,
  COURSES,
  DUTY_TYPES,
}) => {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [year, setYear] = useState(null);
  const [course, setCourse] = useState(null);
  const [dutyType, setDutyType] = useState(null);
  const [schedules, setSchedules] = useState([{ day: "", startTime: "", endTime: "", room: "" }]);

    const [successModalVisible, setSuccessModalVisible] = useState(false); // ✅ Success modal state

  useEffect(() => {
    if (visible) {
      setStudentName(initialData?.name || "");
      setStudentId(initialData?.id || "");
      setYear(initialData?.year || null);
      setCourse(initialData?.course || null);
      setDutyType(initialData?.duty || null);
      setSchedules(initialData?.schedules || [{ day: "", startTime: "", endTime: "", room: "" }]);
    }
  }, [visible, initialData]);

  const isEditing = !!initialData;

  const isFormComplete =
    studentName &&
    studentId &&
    year &&
    course &&
    dutyType &&
    schedules.every((s) =>
      dutyType === "Attendance Checker"
        ? s.day && s.startTime && s.endTime
        : s.day && s.startTime && s.endTime && s.room
    );

  const handleSave = () => {
  if (!isFormComplete) return Alert.alert("Missing Info", "Please fill in all fields.");

  for (let s of schedules) {
    const startIndex = TIMES.indexOf(s.startTime);
    const endIndex = TIMES.indexOf(s.endTime);
    if (startIndex >= endIndex) {
      return Alert.alert("Invalid Time", "End time must be later than Start time.");
    }
  }

  const dutyData = { 
  name: studentName,
  id: studentId,
  year,
  course,
  duty: dutyType,
  schedules,
  status: "Active" // ✅ default status
};

  onSave(dutyData, isEditing);

  // ✅ Close the form modal, then show success modal
  onClose();
  setSuccessModalVisible(true);
};

 const closeSuccessModal = () => {
  setSuccessModalVisible(false);
};

  const addSchedule = () => {
    setSchedules([...schedules, { day: "", startTime: "", endTime: "", room: "" }]);
  };

  const updateSchedule = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  // Helper for dropdown data formatting
  const toDropdownData = (arr) => arr.map((v) => ({ label: v, value: v }));

  return (
       <>
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>{isEditing ? "Edit Scholar Duty" : "Assign Scholar Duty"}</Text>

            {/* Student Info */}
            <Text style={styles.label}>Student Name</Text>
            <TextInput
              placeholder="Enter Student Name"
              placeholderTextColor="#888"
              value={studentName}
              onChangeText={setStudentName}
              style={styles.input}
            />

            <Text style={styles.label}>Student ID</Text>
            <TextInput
             placeholder="00-0000-000000"
              placeholderTextColor="#888"
              value={studentId}
              keyboardType="numeric"
              onChangeText={(text) => {
                let formatted = text.replace(/[^0-9-]/g, "");
                if (formatted.length === 2 && studentId.length < 2) formatted += "-";
                if (formatted.length === 7 && studentId.length < 7) formatted += "-";
                setStudentId(formatted);
              }}
              maxLength={14}
              style={styles.input}
            />

            {/* Year */}
            <Text style={styles.label}>Year</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={toDropdownData(YEARS)}
              labelField="label"
              valueField="value"
              placeholder="Select Year"
              value={year}
              onChange={(item) => setYear(item.value)}
              renderLeftIcon={() => (
                <AntDesign name="calendar" size={16} color="#555" style={styles.icon} />
              )}
            />

            {/* Course */}
            <Text style={styles.label}>Course</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={toDropdownData(COURSES)}
              labelField="label"
              valueField="value"
              placeholder="Select Course"
              value={course}
              onChange={(item) => setCourse(item.value)}
              renderLeftIcon={() => (
                <AntDesign name="book" size={16} color="#555" style={styles.icon} />
              )}
            />

            {/* Duty Type */}
            <Text style={styles.label}>Duty Type</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={toDropdownData(DUTY_TYPES)}
              labelField="label"
              valueField="value"
              placeholder="Select Duty Type"
              value={dutyType}
              onChange={(item) => setDutyType(item.value)}
              renderLeftIcon={() => (
                <AntDesign name="idcard" size={16} color="#555" style={styles.icon} />
              )}
            />

            {/* Schedules */}
            <Text style={styles.sectionTitle}>Schedules</Text>
            {schedules.map((sched, index) => (
              <View key={index} style={styles.scheduleCard}>
                <Text style={styles.scheduleTitle}>Schedule {index + 1}</Text>

                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={toDropdownData(DAYS)}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Day"
                  value={sched.day}
                  onChange={(item) => updateSchedule(index, "day", item.value)}
                  renderLeftIcon={() => (
                    <AntDesign name="calendar" size={16} color="#555" style={styles.icon} />
                  )}
                />

                <View style={styles.row}>
                  <Dropdown
                    style={[styles.dropdown, { flex: 1, marginRight: 5 }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={toDropdownData(TIMES)}
                    labelField="label"
                    valueField="value"
                    placeholder="Start Time"
                    value={sched.startTime}
                    onChange={(item) => updateSchedule(index, "startTime", item.value)}
                  />
                  <Dropdown
                    style={[styles.dropdown, { flex: 1, marginLeft: 5 }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={toDropdownData(TIMES)}
                    labelField="label"
                    valueField="value"
                    placeholder="End Time"
                    value={sched.endTime}
                    onChange={(item) => updateSchedule(index, "endTime", item.value)}
                  />
                </View>

                {dutyType !== "Attendance Checker" && (
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={toDropdownData(ROOMS)}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Room"
                    value={sched.room}
                    onChange={(item) => updateSchedule(index, "room", item.value)}
                    renderLeftIcon={() => (
                      <AntDesign name="home" size={16} color="#555" style={styles.icon} />
                    )}
                  />
                )}
              </View>
            ))}

            <TouchableOpacity onPress={addSchedule} style={styles.addScheduleBtn}>
              <Text style={styles.addScheduleText}>+ Add Another Schedule</Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.saveBtn, !isFormComplete && { backgroundColor: "gray" }]}
                onPress={handleSave}
                disabled={!isFormComplete}
              >
                <Text style={styles.btnText}>{isEditing ? "Update" : "Save"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
     {/* 🎉 Success Modal */}
    {/* 🎉 Success Modal */}
<Modal visible={successModalVisible} transparent animationType="fade">
  <View style={styles.successOverlay}>
    {/* Confetti should be at overlay level, not inside box */}
    <ConfettiCannon
      count={150}
      origin={{ x: -10, y: 0 }}
      fadeOut={true}
    />

    <View style={styles.successBox}>
      <TouchableOpacity style={styles.closeIcon} onPress={closeSuccessModal}>
        <AntDesign name="close" size={22} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.successText}>✅ Successfully Added New Scholar</Text>
    </View>
  </View>
</Modal>

    </>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: Platform.OS === "web" ? "50%" : "90%",
    maxWidth: 600,
    maxHeight: "90%",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    fontSize: 13,
  },
  label: { fontWeight: "600", marginBottom: 5, fontSize: 13 },
  dropdown: {
    height: 38,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  placeholderStyle: { fontSize: 13, color: "#999" },
  selectedTextStyle: { fontSize: 13, color: "#000" },
  icon: { marginRight: 6 },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginVertical: 10 },
  scheduleCard: {
    backgroundColor: "#f9fafc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  scheduleTitle: { fontWeight: "600", marginBottom: 8, fontSize: 13 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  addScheduleBtn: { backgroundColor: "#0078d7", padding: 10, borderRadius: 8, marginVertical: 10 },
  addScheduleText: { color: "white", fontWeight: "600", textAlign: "center" },
  btnRow: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "space-between",
    gap: 10,
  },
  saveBtn: { backgroundColor: "green", padding: 10, borderRadius: 8, flex: 1 },
  cancelBtn: { backgroundColor: "red", padding: 10, borderRadius: 8, flex: 1 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
 // ✅ Success Modal styles
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  successBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 300,
    alignItems: "center",
    position: "relative",
  },
  successText: {
    fontSize: 16,
    fontWeight: "700",
    color: "green",
    textAlign: "center",
    marginVertical: 20,
  },
  closeIcon: { position: "absolute", top: 10, right: 10 },
});


export default ScholarDutyFormModal;
