import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import ScholarDutyCard from "../components/ScholarDutyCard";
import ScholarDutyFormModal from "../components/ScholarDutyFormModal";
import ScholarDutyViewModal from "../components/ScholarDutyViewModal";

const PRIMARY_COLOR = "#00A4DF";

export default function DutyManagement() {
  const [duties, setDuties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [viewDuty, setViewDuty] = useState(null);

  // Save duty
  const saveDuty = (duty, isEditing) => {
    if (isEditing && editIndex !== null) {
      const updated = [...duties];
      updated[editIndex] = duty;
      setDuties(updated);
    } else {
      setDuties([...duties, duty]);
    }
    setModalVisible(false);
    setEditIndex(null);
  };

  // Filter by search
  const filteredDuties = duties.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header with button */}
      <View style={styles.header}>
        <Text style={styles.title}>Duty Management</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnText}>+ Assign Duty</Text>
        </TouchableOpacity>
      </View>

      {/* 🔎 Search bar */}
      <TextInput
        placeholder="Search duty..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      {/* Duty List */}
      <ScrollView>
        <Text style={styles.sectionTitle}>
          Assigned Duties ({filteredDuties.length})
        </Text>

        {filteredDuties.map((d, i) => (
          <ScholarDutyCard
            key={i}
            duty={d}
            onEdit={() => {
              setEditIndex(i);
              setModalVisible(true);
            }}
            onView={() => setViewDuty({ ...d, index: i })}
          />
        ))}
      </ScrollView>

      {/* Form Modal */}
      <ScholarDutyFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditIndex(null);
        }}
        onSave={saveDuty}
        initialData={editIndex !== null ? duties[editIndex] : null}
        YEARS={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
        COURSES={[
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
        ]}
        DUTY_TYPES={["Student Facilitator", "Attendance Checker"]}
        DAYS={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
        TIMES={[
          "7:00 AM",
          "8:00 AM",
          "9:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "1:00 PM",
          "2:00 PM",
          "3:00 PM",
          "4:00 PM",
          "5:00 PM",
        ]}
        ROOMS={[
          "201", "202", "CL1", "CL2", "208", "209",
          "301", "302", "304", "305", "307", "308", "309",
          "401", "402", "403", "404", "405", "CL3", "CL4",
          "408", "409",
        ]}
      />

      {/* View Modal */}
      <ScholarDutyViewModal
  duty={viewDuty}
  onClose={() => setViewDuty(null)}
  onDeactivate={(index) => {
    const updated = [...duties];
    updated.splice(index, 1); // remove duty
    setDuties(updated);
    setViewDuty(null); // close modal after deactivation
  }}
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
  },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 30 },
  createBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 30,
  },
  btnText: { color: "white", fontWeight: "600" },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
});
