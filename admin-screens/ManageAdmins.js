import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AdminModalForm from "../components/AdminModalForm";
import AdminTable from "../components/AdminTable";

const PRIMARY_COLOR = "#00A4DF";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Save function (Add or Edit)
  const saveAdmin = (adminData, isEditing) => {
    if (isEditing && editIndex !== null) {
      const updated = [...admins];
      updated[editIndex] = { ...updated[editIndex], ...adminData };
      setAdmins(updated);
    } else {
      // New admins default to Active
      setAdmins([...admins, { ...adminData, status: "Active" }]);
    }
    setModalVisible(false);
    setEditIndex(null);
  };

  // Disable admin
  const disableAdmin = (index) => {
    const updated = [...admins];
    updated[index].status = "Inactive";
    setAdmins(updated);
  };

  // Reactivate admin
  const reactivateAdmin = (index) => {
    const updated = [...admins];
    updated[index].status = "Active";
    setAdmins(updated);
  };

  // 📊 Stats
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter((a) => a.status === "Active").length;
  const inactiveAdmins = admins.filter((a) => a.status === "Inactive").length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Manage Admins</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnText}>+ Create Admin</Text>
        </TouchableOpacity>
      </View>

      {/* 📊 Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#E0F7FA" }]}>
          <Text style={styles.statNumber}>{totalAdmins}</Text>
          <Text style={styles.statLabel}>Total Admins</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#E8F5E9" }]}>
          <Text style={styles.statNumber}>{activeAdmins}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FFEBEE" }]}>
          <Text style={styles.statNumber}>{inactiveAdmins}</Text>
          <Text style={styles.statLabel}>Inactive</Text>
        </View>
      </View>

      {/* Admins Table */}
      <ScrollView>
        <AdminTable
          admins={admins}
          onDisable={disableAdmin}
          onReactivate={reactivateAdmin}
        />
      </ScrollView>

      {/* Modal */}
      <AdminModalForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditIndex(null);
        }}
        onSave={saveAdmin}
        initialData={editIndex !== null ? admins[editIndex] : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  createBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "600" },

  // Stats section
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#333" },
  statLabel: { fontSize: 12, color: "#555", marginTop: 4 },
});
