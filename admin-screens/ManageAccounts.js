import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import ScholarCard from "../components/ScholarCard";
import ScholarFormModal from "../components/ScholarFormModal";
import ScholarViewModal from "../components/ScholarViewModal";
import DeactivatedTable from "../components/DeactivatedTable";

const PRIMARY_COLOR = "#00A4DF";
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
const DUTY_TYPES = ["Student Facilitator", "Attendance Checker"];

export default function ManageAccounts() {
  const [scholars, setScholars] = useState([]);
  const [deactivated, setDeactivated] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
  name: "",
  id: "",
  year: "",
  course: "",  // empty means "Select Course" shows
  duty: "",
});

  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [viewScholar, setViewScholar] = useState(null);

  // Update form fields
  const updateForm = (field, value) => setForm({ ...form, [field]: value });

  // Save function for Add / Edit
  const saveScholar = () => {
    if (editIndex !== null) {
      // Editing existing
      const updated = [...scholars];
      updated[editIndex] = form;
      setScholars(updated);
    } else {
      // Adding new
      setScholars([...scholars, form]);
    }
    resetForm();
  };

  // Cancel / Reset
  const resetForm = () => {
    setForm({
      name: "",
      id: "",
      year: YEARS[0],
      course: COURSES[0],
      duty: DUTY_TYPES[0],
    });
    setEditIndex(null);
    setModalVisible(false);
  };

  // Deactivate a scholar
  const deactivateScholar = (index) => {
    const scholar = scholars[index];
    setDeactivated([...deactivated, { ...scholar, status: "Deactivated" }]);
    setScholars(scholars.filter((_, i) => i !== index));
    setViewScholar(null);
  };

  // Reactivate a scholar
  const reactivateScholar = (index) => {
    const scholar = deactivated[index];
    setScholars([...scholars, scholar]);
    setDeactivated(deactivated.filter((_, i) => i !== index));
  };

  // Search filter
  const filtered = scholars.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header with button */}
      <View style={styles.header}>
        <Text style={styles.title}>Manage Accounts</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnText}>+ Create Scholar Account</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search scholar..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <ScrollView>
        {/* Scholar Accounts */}
        <Text style={styles.sectionTitle}>
          Scholar Accounts ({scholars.length})
        </Text>
        {filtered.map((s, i) => (
          <ScholarCard
            key={i}
            scholar={s}
            onEdit={() => {
              setEditIndex(i);
              setForm(s);
              setModalVisible(true);
            }}
            onView={() => setViewScholar({ ...s, index: i })}
          />
        ))}

        {/* Deactivated Table */}
        {deactivated.length > 0 && (
          <DeactivatedTable
            deactivated={deactivated}
            onReactivate={reactivateScholar}
          />
        )}
      </ScrollView>

      {/* Modals */}
      <ScholarFormModal
  visible={modalVisible}
  onClose={resetForm}
  onSave={saveScholar}
  initialData={editIndex !== null ? form : null}
  YEARS={YEARS}
  COURSES={COURSES}
  DUTY_TYPES={DUTY_TYPES}
/>


      <ScholarViewModal
        scholar={viewScholar}
        onClose={() => setViewScholar(null)}
        onDeactivate={deactivateScholar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // make sure button aligns vertically
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 30  },
  createBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 30
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
