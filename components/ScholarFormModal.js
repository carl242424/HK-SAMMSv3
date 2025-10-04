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

const ScholarFormModal = ({
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
  const [isFocus, setIsFocus] = useState({ year: false, course: false, duty: false });

  useEffect(() => {
    if (visible) {
      setStudentName(initialData?.name || "");
      setStudentId(initialData?.id || "");
      setYear(initialData?.year || null);
      setCourse(initialData?.course || null);
      setDutyType(initialData?.duty || null);
    }
  }, [visible, initialData]);

  const isEditing = !!initialData;

  const handleSave = () => {
    if (!studentName || !studentId || !year || !course || !dutyType) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    const scholarData = {
      name: studentName,
      id: studentId,
      year,
      course,
      duty: dutyType,
    };

    onSave(scholarData, isEditing);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>
              {isEditing ? "Edit Scholar Account" : "Create Scholar Account"}
            </Text>

            {/* Student Info */}
            <TextInput
              placeholder="Student Name"
              value={studentName}
              onChangeText={setStudentName}
              style={styles.input}
            />

            <TextInput
              placeholder="00-0000-000000"
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

            {/* Year Dropdown */}
            <Text style={styles.label}>Year</Text>
            <Dropdown
              style={[
                styles.dropdown,
                isFocus.year && { borderColor: "#0078d7" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={YEARS.map((y) => ({ label: y, value: y }))}
              labelField="label"
              valueField="value"
              placeholder={!isFocus.year ? "Select Year" : "..."}
              value={year}
              onFocus={() => setIsFocus({ ...isFocus, year: true })}
              onBlur={() => setIsFocus({ ...isFocus, year: false })}
              onChange={(item) => {
                setYear(item.value);
                setIsFocus({ ...isFocus, year: false });
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus.year ? "#0078d7" : "black"}
                  name="calendar"
                  size={18}
                />
              )}
            />

            {/* Course Dropdown */}
            <Text style={styles.label}>Course</Text>
            <Dropdown
              style={[
                styles.dropdown,
                isFocus.course && { borderColor: "#0078d7" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={COURSES.map((c) => ({ label: c, value: c }))}
              labelField="label"
              valueField="value"
              placeholder={!isFocus.course ? "Select Course" : "..."}
              value={course}
              onFocus={() => setIsFocus({ ...isFocus, course: true })}
              onBlur={() => setIsFocus({ ...isFocus, course: false })}
              onChange={(item) => {
                setCourse(item.value);
                setIsFocus({ ...isFocus, course: false });
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus.course ? "#0078d7" : "black"}
                  name="book"
                  size={18}
                />
              )}
            />

            {/* Duty Type Dropdown */}
            <Text style={styles.label}>Duty Type</Text>
            <Dropdown
              style={[
                styles.dropdown,
                isFocus.duty && { borderColor: "#0078d7" },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={DUTY_TYPES.map((d) => ({ label: d, value: d }))}
              labelField="label"
              valueField="value"
              placeholder={!isFocus.duty ? "Select Duty Type" : "..."}
              value={dutyType}
              onFocus={() => setIsFocus({ ...isFocus, duty: true })}
              onBlur={() => setIsFocus({ ...isFocus, duty: false })}
              onChange={(item) => {
                setDutyType(item.value);
                setIsFocus({ ...isFocus, duty: false });
              }}
              renderLeftIcon={() => (
  <AntDesign
    style={styles.icon}
    color={isFocus.duty ? "#0078d7" : "black"}
    name="idcard"   // ✅ use this instead of "Safety"
    size={18}
  />
)}
            />

            {/* Buttons */}
            <View style={styles.row}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.btnText}>
                  {isEditing ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: Platform.OS === "web" ? 450 : "90%",
    maxWidth: 500,
    maxHeight: "90%",
  },
  scrollContent: { flexGrow: 1 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  label: { fontWeight: "600", marginBottom: 5, fontSize: 14 },
  dropdown: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: { marginRight: 5 },
  placeholderStyle: { fontSize: 13, color: "#888" },
  selectedTextStyle: { fontSize: 13, color: "#000" },
  inputSearchStyle: { height: 35, fontSize: 13 },
  iconStyle: { width: 18, height: 18 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveBtn: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
  cancelBtn: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
  },
  btnText: { color: "#fff", fontWeight: "600", textAlign: "center" },
});

export default ScholarFormModal;
