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
import Ionicons from "@expo/vector-icons/Ionicons"; 
import ConfettiCannon from "react-native-confetti-cannon"; 

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
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [year, setYear] = useState(null);
  const [course, setCourse] = useState(null);
  const [dutyType, setDutyType] = useState(null);
  const [isFocus, setIsFocus] = useState({
    year: false,
    course: false,
    duty: false,
  });

  // ✅ Success modal state
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setStudentName(initialData?.name || "");
      setStudentId(initialData?.id || "");
      setPassword(initialData?.password || "");
      setYear(initialData?.year || null);
      setCourse(initialData?.course || null);
      setDutyType(initialData?.duty || null);
    }else if (visible && !initialData) {
    // Clear form if it's a fresh new form (not editing)
    setStudentName("");
    setStudentId("");
    setPassword("");
    setYear(null);
    setCourse(null);
    setDutyType(null);
  }
  }, [visible, initialData]);

  const isEditing = !!initialData;

  const handleSave = () => {
    if (!studentName || !studentId || !password || !year || !course || !dutyType) {
      Alert.alert("Missing Info", "Please fill in all fields including password.");
      return;
    }

    const scholarData = {
      name: studentName,
      id: studentId,
      password,
      year,
      course,
      duty: dutyType,
    };

    onSave(scholarData, isEditing);
    onClose(); 
    setSuccessModalVisible(true); // ✅ show success modal
  };

  const closeSuccessModal = () => setSuccessModalVisible(false);

  return (
    <>
      {/* Main Form Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.title}>
                {isEditing ? "Edit Scholar Account" : "Create Scholar Account"}
              </Text>

              {/* Student Info */}
              <Text style={styles.label}>Student Name</Text>
              <TextInput
                placeholder="Student Name"
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

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password..."
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>

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
                    name="idcard"
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

      {/* ✅ Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <ConfettiCannon count={120} origin={{ x: -10, y: 0 }} fadeOut={true} />
          <View style={styles.successBox}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeSuccessModal}>
              <AntDesign name="close" size={22} color="#333" />
            </TouchableOpacity>
            <Text style={styles.confettiIcon}>🎉</Text>
            <Text style={styles.successText}>✅ Scholar Account Successfully Saved</Text>
          </View>
        </View>
      </Modal>
    </>
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
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    zIndex: 20,
    marginBottom: 6,
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
  confettiIcon: { fontSize: 40, marginBottom: 10 },
  closeIcon: { position: "absolute", top: 10, right: 10 },
});

export default ScholarFormModal;
