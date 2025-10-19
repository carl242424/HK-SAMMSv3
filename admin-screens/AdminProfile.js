import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Add navigation hook

const PRIMARY_COLOR = "#00A4DF";

export default function AdminProfile() {
  const [adminData, setAdminData] = useState({
    name: "Test",
    id: "000-000-000",
    status: "Active",
    password: "********",
  });
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Retrieved token:", token ? token.slice(0, 20) + "..." : "null");

        if (!token) {
          console.error("No token found, redirecting to login");
          navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
          return;
        }

        const response = await axios.get("http://192.168.100.237:8000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Profile response:", response.data);
        const user = response.data;
        setAdminData({
          name: user.username,
          id: user.employeeId || "N/A",
          status: user.status,
          password: "********",
        });
      } catch (error) {
        console.error("Error fetching profile:", error.message, error.response?.data);
        setAdminData({
          name: "Error",
          id: "Error",
          status: "Error",
          password: "********",
        });
        // Redirect to login on 401 or 404 errors
        if (error.response?.status === 401 || error.response?.status === 404) {
          console.error("Authentication failed, redirecting to login");
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("role");
          navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
        }
      }
    };

    fetchProfile();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role");
      console.log("Logged out successfully");
      navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>
      <View style={styles.profileCard}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{adminData.name}</Text>
        <Text style={styles.label}>Employee ID:</Text>
        <Text style={styles.value}>{adminData.id}</Text>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            adminData.status === "Active" ? styles.active : styles.inactive,
          ]}
        >
          {adminData.status}
        </Text>
        <Text style={styles.label}>Password:</Text>
        <Text style={styles.value}>{adminData.password}</Text>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 14, color: "#555", marginTop: 10 },
  value: { fontSize: 16, fontWeight: "600", color: "#333" },
  active: { color: "green" },
  inactive: { color: "red" },
  logoutBtn: {
    backgroundColor: "#ffcccc",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  logoutText: { color: "#a60000", fontWeight: "600" },
});