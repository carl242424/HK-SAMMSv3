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
import Ionicons from "@expo/vector-icons/Ionicons";

const AdminModalForm = ({ visible, onClose, onSave, initialData = null }) => {
  const [adminName, setAdminName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (visible) {
      setAdminName(initialData?.name || "");
      setEmployeeId(initialData?.id || "");
      setPassword(initialData?.password || "");
    }
  }, [visible, initialData]);

  const isEditing = !!initialData;

  const handleSave = () => {
    if (!adminName || !employeeId || !password) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    const adminData = {
      name: adminName,
      id: employeeId, // keep `id` key for compatibility with table
      password,
      status: "Active",
    };

    onSave(adminData, isEditing);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>
              {isEditing ? "Edit Admin Account" : "Create Admin Account"}
            </Text>

            {/* Admin Name */}
            <Text style={styles.label}>Admin Name</Text>
            <TextInput
              placeholder="Enter Admin Name"
              value={adminName}
              onChangeText={setAdminName}
              style={styles.input}
            />

            {/* Employee ID */}
            <Text style={styles.label}>Employee ID</Text>
            <TextInput
              placeholder="Enter Employee ID"
              value={employeeId}
              onChangeText={setEmployeeId}
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
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

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
  },
  label: { fontWeight: "600", marginBottom: 5, fontSize: 14 },
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

export default AdminModalForm;
