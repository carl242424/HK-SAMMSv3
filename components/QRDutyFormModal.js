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

const parseTimeToDate = (timeStr, day, currentDate = new Date()) => {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let adjustedHours = hours;
  if (period === "PM" && hours !== 12) adjustedHours += 12;
  if (period === "AM" && hours === 12) adjustedHours = 0;

  const date = new Date(currentDate);
  date.setHours(adjustedHours, minutes, 0, 0);
  return date;
};

const isScheduleInPast = (startTime, day, currentDate = new Date()) => {
  const scheduleDate = parseTimeToDate(startTime, day, currentDate);
  return scheduleDate < currentDate;
};

const isScheduleExpired = (endTime, day, currentDate = new Date()) => {
  const scheduleEndDate = parseTimeToDate(endTime, day, currentDate);
  return scheduleEndDate < currentDate;
};

const isWithinSchedule = (startTime, endTime, day, currentDate = new Date()) => {
  const start = parseTimeToDate(startTime, day, currentDate);
  const end = parseTimeToDate(endTime, day, currentDate);

  const gracePeriodMs = 5 * 60 * 1000;
  const adjustedStart = new Date(start.getTime() - gracePeriodMs);
  const adjustedEnd = new Date(end.getTime() + gracePeriodMs);

  return currentDate >= adjustedStart && currentDate <= adjustedEnd;
};

export default function QRDutyFormModal({
  visible,
  onClose,
  onSave,
  initialData = null,
  fetchedDuties,
  YEARS,
  COURSES,
  DUTY_TYPES,
  DAYS,
  TIMES,
  ROOMS,
}) {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [year, setYear] = useState(null);
  const [course, setCourse] = useState(null);
  const [dutyType, setDutyType] = useState(null);
  const [schedules, setSchedules] = useState([{ day: "", startTime: "", endTime: "", room: "" }]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [invalidModalVisible, setInvalidModalVisible] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");

  useEffect(() => {
    if (visible) {
      let initialSchedules = initialData?.schedules || [{ day: "", startTime: "", endTime: "", room: "" }];
      initialSchedules = initialSchedules.filter(
        (sched) => !sched.endTime || !isScheduleExpired(sched.endTime, sched.day)
      );
      setStudentName(initialData?.name || "");
      setStudentId(initialData?.id || "");
      setYear(initialData?.year || null);
      setCourse(initialData?.course || null);
      setDutyType(initialData?.duty || null);
      setSchedules(initialSchedules.length > 0 ? initialSchedules : [{ day: "", startTime: "", endTime: "", room: "" }]);
    }
  }, [visible, initialData]);

  useEffect(() => {
    if (studentId && fetchedDuties && fetchedDuties.length > 0) {
      const matchingDuty = fetchedDuties.find((duty) => duty.id === studentId.trim());
      if (matchingDuty) {
        setStudentName(matchingDuty.name || "");
        setYear(matchingDuty.year || null);
        setCourse(matchingDuty.course || null);
        setDutyType(matchingDuty.dutyType || null);
        setSchedules(matchingDuty.schedules && matchingDuty.schedules.length > 0
          ? matchingDuty.schedules.map(s => ({
            day: s.day || "",
            startTime: s.startTime || "",
            endTime: s.endTime || "",
            room: s.room || ""
          }))
          : [{ day: "", startTime: "", endTime: "", room: "" }]);
      } else {
        setStudentName("");
        setYear(null);
        setCourse(null);
        setDutyType(null);
        setSchedules([{ day: "", startTime: "", endTime: "", room: "" }]);
      }
    }
  }, [studentId, fetchedDuties]);

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
    if (!isFormComplete) {
      return Alert.alert("Missing Info", "Please fill in all fields.");
    }

    for (let s of schedules) {
      const startIndex = TIMES.indexOf(s.startTime);
      const endIndex = TIMES.indexOf(s.endTime);

      if (startIndex === -1 || endIndex === -1) {
        return Alert.alert("Invalid Selection", "Please select valid start and end times.");
      }

      if (startIndex >= endIndex) {
        return Alert.alert("Invalid Time", "End time must be later than start time.");
      }

      const diff = endIndex - startIndex;
      if (diff < 2) {
        return Alert.alert("Invalid Duty Duration", "1hr or above allowed duty hours.");
      }

      if (!isWithinSchedule(s.startTime, s.endTime, s.day)) {
        setInvalidMessage(
          "The time for this duty has already passed or has not yet started. Please choose another schedule."
        );
        setInvalidModalVisible(true);
        return;
      }
    }

    const dutyData = {
      name: studentName,
      id: studentId,
      year,
      course,
      duty: dutyType,
      schedules,
      status: "Active",
    };

    onSave(dutyData, isEditing);
    onClose();
    setSuccessModalVisible(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const closeInvalidModal = () => {
    setInvalidModalVisible(false);
  };

  const addSchedule = () => {
    setSchedules([...schedules, { day: "", startTime: "", endTime: "", room: "" }]);
  };

  const updateSchedule = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const toDropdownData = (arr) => arr.map((v) => ({ label: v, value: v }));

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.title}>{isEditing ? "Edit Scholar Duty" : "Duty QR Form"}</Text>

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

      <Modal visible={invalidModalVisible} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeInvalidModal}>
              <AntDesign name="close" size={22} color="#333" />
            </TouchableOpacity>
            <Text style={[styles.successText, { color: "red" }]}>
              ⚠️ {invalidMessage}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <ConfettiCannon count={150} origin={{ x: -10, y: 0 }} fadeOut={true} />
          <View style={styles.successBox}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeSuccessModal}>
              <AntDesign name="close" size={22} color="#333" />
            </TouchableOpacity>
            <Text style={styles.successText}>
              ✅ Successfully {isEditing ? "Updated" : "Added"} Scholar Duty
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

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