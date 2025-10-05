import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import ScholarFormModal from "../components/ScholarFormModal";
import ScholarViewModal from "../components/ScholarViewModal";
import DeactivatedTable from "../components/DeactivatedTable";
import ScholarTable from "../components/ScholarTable";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const PRIMARY_COLOR = "#00A4DF";
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const COURSES = [
  "BS ACCOUNTANCY", "BS HOSPITALITY MANAGEMENT", "BS TOURISM MANAGEMENT",
  "BSBA- MARKETING MANAGEMENT", "BSBA- BANKING & MICROFINANCE", 
  "BACHELOR OF ELEMENTARY EDUCATION", "BSED- ENGLISH", "BSED- FILIPINO", 
  "BS CRIMINOLOGY", "BS CIVIL ENGINEERING", "BS INFORMATION TECHNOLOGY", "BS NURSING"
];
const DUTY_TYPES = ["Student Facilitator", "Attendance Checker"];

export default function ManageAccounts() {
  const [scholars, setScholars] = useState([]);
  const [deactivated, setDeactivated] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "", id: "", year: YEARS[0], course: COURSES[0], duty: DUTY_TYPES[0]
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [viewScholar, setViewScholar] = useState(null);

  const updateForm = (field, value) => setForm(prevForm => ({ ...prevForm, [field]: value }));

  const saveScholar = (data, isEditing) => {
    if (isEditing && editIndex !== null) {
      const updated = [...scholars];
      updated[editIndex] = data;
      setScholars(updated);
    } else {
      setScholars([...scholars, { ...data, remainingHours: 100, status: "active" }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({ name: "", id: "", year: YEARS[0], course: COURSES[0], duty: DUTY_TYPES[0] });
    setEditIndex(null);
    setModalVisible(false);
  };

  const deactivateScholar = index => {
    const scholar = scholars[index];
    setDeactivated([...deactivated, { ...scholar, status: "Deactivated" }]);
    setScholars(scholars.filter((_, i) => i !== index));
    setViewScholar(null);
  };

  const reactivateScholar = index => {
    const scholar = deactivated[index];
    setScholars([...scholars, scholar]);
    setDeactivated(deactivated.filter((_, i) => i !== index));
  };

  const filteredScholars = scholars.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToPDF = async (filteredScholars, deactivated) => {
  const escapeHtml = (text) => String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Scholar Accounts Report</title>
        <style>
          body { font-family: Helvetica, Arial, sans-serif; margin: 20px; font-size: 12px; line-height: 1.4; }
          h1 { text-align: center; color: #333; }
          h2 { text-align: center; margin-top: 30px; page-break-before: avoid; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
          th { background-color: #f0f0f0; font-weight: bold; }
          tbody tr:nth-child(even) { background-color: #f9f9f9; }
          .empty { text-align: center; color: #999; font-style: italic; }
          @page { margin: 1in; }
          @media print { body { -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <h1>Scholar Accounts Report</h1>
        <p style="text-align: center;">Generated: ${new Date().toLocaleDateString()} | Total Active: ${filteredScholars.length} | Deactivated: ${deactivated.length}</p>

        <h2>Active Scholars</h2>
        <table>
          <thead><tr><th>Name</th><th>ID</th><th>Year</th><th>Course</th><th>Duty</th><th>Hours Left</th><th>Status</th></tr></thead>
          <tbody>
            ${filteredScholars.length > 0
              ? filteredScholars.map(s => `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.id)}</td><td>${escapeHtml(s.year)}</td><td>${escapeHtml(s.course)}</td><td>${escapeHtml(s.duty)}</td><td>${s.remainingHours ?? 0}</td><td>${s.status ?? 'Active'}</td></tr>`).join('')
              : '<tr class="empty"><td colspan="7">No active scholars found.</td></tr>'
            }
          </tbody>
        </table>

        <h2 style="page-break-before: always;">Deactivated Scholars</h2>
        <table>
          <thead><tr><th>Name</th><th>ID</th><th>Year</th><th>Course</th><th>Duty</th><th>Hours Left</th><th>Status</th></tr></thead>
          <tbody>
            ${deactivated.length > 0
              ? deactivated.map(s => `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.id)}</td><td>${escapeHtml(s.year)}</td><td>${escapeHtml(s.course)}</td><td>${escapeHtml(s.duty)}</td><td>${s.remainingHours ?? 0}</td><td>Deactivated</td></tr>`).join('')
              : '<tr class="empty"><td colspan="7">No deactivated scholars.</td></tr>'
            }
          </tbody>
        </table>
      </body>
    </html>
  `;

  console.log('HTML Content Preview:', htmlContent.substring(0, 500) + '...');  // Log for debugging

  try {
    // Generate PDF from HTML (ensures no screen fallback)
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
      width: 612,  // Letter size (adjust for A4: 595)
      height: 792,
    });

    console.log('PDF URI:', uri);

    // Optional: Direct HTML preview (bypasses file—test this first!)
    // await Print.printAsync({ html: htmlContent });

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Scholar Report PDF',
        UTI: 'public.pdf',  // Helps iOS recognize as PDF
      });
    } else {
      Alert.alert('PDF Ready', `File saved at:\n${uri}\n\nOpen in a PDF viewer to check.`);
    }
  } catch (error) {
    console.error('Full Error:', error);
    Alert.alert('PDF Error', `Could not generate PDF:\n${error.message}\n\nTry the direct preview above.`);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Accounts</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>+ Create Scholar Account</Text> 
        </TouchableOpacity>
      </View>

      <TextInput 
        placeholder="Search scholar..." 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
        style={styles.search} 
      />

      <ScrollView>
        {/* Scholar Table Section with Export Button */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Scholar Accounts ({filteredScholars.length})</Text>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => exportToPDF(filteredScholars, deactivated)}
          >
            <Text style={styles.exportBtnText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        <ScholarTable
          scholars={filteredScholars}
          onView={(scholar) => setViewScholar(scholar)}
          onEdit={(index) => {
            setEditIndex(index);
            setForm(filteredScholars[index]);
            setModalVisible(true);
          }}
          onDeactivate={(index) => deactivateScholar(index)}
          onReactivate={(index) => reactivateScholar(index)}
        />

        {/* Deactivated Table */}
        {deactivated.length > 0 && (
          <DeactivatedTable deactivated={deactivated} onReactivate={reactivateScholar} />
        )}
      </ScrollView>

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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 30 },
  createBtn: { backgroundColor: PRIMARY_COLOR, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 6, marginTop: 30 },
  btnText: { color: "white", fontWeight: "600" },
  search: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  exportBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  exportBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});