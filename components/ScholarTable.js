import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from "react-native";

const ScholarTable = ({ scholars = [], onReactivate, onEdit, onView, onDeactivate }) => {
  const { width: screenWidth } = useWindowDimensions();

  // Base column setup
  const columnWidth = 120; // each normal column min width
  const actionWidth = 200; // actions column fixed
  const totalColumns = 8; // student, id, year, course, duty, remaining hrs, duty status, status
  const tableMinWidth = totalColumns * columnWidth + actionWidth; // e.g. 1160px

  return (
    <ScrollView
      horizontal={screenWidth < tableMinWidth} // scroll only if screen is smaller
      style={{ width: "100%" }}
      contentContainerStyle={{
        minWidth: screenWidth < tableMinWidth ? tableMinWidth : "100%",
        paddingRight: 16,
      }}
    >
      <View style={[styles.tableContainer, { width: "100%" }]}>
        {/* Header Row */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.header]}>Student</Text>
          <Text style={[styles.cell, styles.header]}>Student ID</Text>
          <Text style={[styles.cell, styles.header]}>Year</Text>
          <Text style={[styles.cell, styles.header]}>Course</Text>
          <Text style={[styles.cell, styles.header]}>Duty</Text>
          <Text style={[styles.cell, styles.header]}>Remaining Hours</Text>
          <Text style={[styles.cell, styles.header]}>Duty Status</Text>
          <Text style={[styles.cell, styles.header]}>Status</Text>
          <Text style={[styles.actionsCellHeader, styles.header]}>Actions</Text>
        </View>

        {/* Scholar Rows */}
        {scholars.map((s, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{s.name}</Text>
            <Text style={styles.cell}>{s.id}</Text>
            <Text style={styles.cell}>{s.year}</Text>
            <Text style={styles.cell}>{s.course}</Text>
            <Text style={styles.cell}>{s.duty}</Text>
            <Text style={styles.cell}>{s.remainingHours ?? 0} hrs</Text>
            <Text style={styles.cell}>
              {s.remainingHours === 0 ? "✅ Completed" : "⏳ Not yet"}
            </Text>
            <Text style={styles.cell}>
              {s.status === "deactivated" ? "Deactivated" : "Active"}
            </Text>

            {/* Actions */}
            <View style={styles.actionsCell}>
              {s.status === "deactivated" ? (
                <TouchableOpacity style={styles.reactivateBtn} onPress={() => onReactivate(index)}>
                  <Text style={styles.btnText}>Reactivate</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => onView(s)}>
                    <Text style={styles.btnText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(index)}>
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deactivateBtn} onPress={() => onDeactivate(index)}>
                    <Text style={styles.btnText}>Deactivate</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: "#f4f4f4",
  },
  cell: {
    flex: 1,
    minWidth: 120,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  actionsCellHeader: {
    width: 200,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  actionsCell: {
    width: 200,
    flexDirection: "row",
    flexWrap: "wrap", // wrap buttons if narrow
  },
  header: {
    fontWeight: "bold",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  viewBtn: {
    backgroundColor: "#0078d7",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  editBtn: {
    backgroundColor: "#f0ad4e",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  deactivateBtn: {
    backgroundColor: "#d9534f",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  reactivateBtn: {
    backgroundColor: "green",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default ScholarTable;
