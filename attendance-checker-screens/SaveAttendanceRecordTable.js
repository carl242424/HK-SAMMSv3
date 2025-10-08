// SaveAttendanceRecordTable.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SaveAttendanceRecordTable = ({ records }) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>Saved Attendance Records</Text>

      {/* Table Header */}
      <View style={styles.tableRowHeader}>
        <Text style={[styles.tableCell, styles.cellHeader]}>Student Name</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Student ID</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Year</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Course</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Duty Type</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Room</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Class Status</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Facilitator Status</Text>
        <Text style={[styles.tableCell, styles.cellHeader]}>Encoded Time</Text>
      </View>

      {/* Table Rows */}
      {records.length === 0 ? (
        <Text style={styles.noRecordsText}>No records saved yet.</Text>
      ) : (
        records.map((record, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{record.studentName}</Text>
            <Text style={styles.tableCell}>{record.studentId}</Text>
            <Text style={styles.tableCell}>{record.yearLevel}</Text>
            <Text style={styles.tableCell}>{record.course}</Text>
            <Text style={styles.tableCell}>{record.dutyType}</Text>
            <Text style={styles.tableCell}>{record.room}</Text>
            <Text style={styles.tableCell}>{record.classStatus}</Text>
                <Text style={styles.tableCell}>{record.facilitatorStatus}</Text>
            <Text style={styles.tableCell}>{record.encodedTime}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    width: "95%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginBottom: 30,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 6,
  },
  tableCell: { flex: 1, textAlign: "center", fontSize: 12, color: "#333" },
  cellHeader: { fontWeight: "700" },
  noRecordsText: {
    textAlign: "center",
    color: "#666",
    paddingVertical: 10,
    fontStyle: "italic",
  },
});

export default SaveAttendanceRecordTable;
