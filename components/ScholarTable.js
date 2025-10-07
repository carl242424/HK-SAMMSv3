import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions } from "react-native";

const ScholarTable = ({ scholars = [], onEdit, onView, onToggleStatus }) => {
  const { width: screenWidth } = useWindowDimensions();

  const columnWidth = 120;
  const actionWidth = 200;
  const totalColumns = 8;
  const tableMinWidth = totalColumns * columnWidth + actionWidth;

  return (
    <ScrollView
      horizontal={screenWidth < tableMinWidth}
      style={{ width: "100%" }}
      contentContainerStyle={{
        minWidth: screenWidth < tableMinWidth ? tableMinWidth : "100%",
        paddingRight: 16,
      }}
    >
      <View style={[styles.tableContainer, { width: "100%" }]}>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.header]}>Student</Text>
          <Text style={[styles.cell, styles.header]}>Student ID</Text>
          <Text style={[styles.cell, styles.header]}>Email</Text>
          <Text style={[styles.cell, styles.header]}>Year</Text>
          <Text style={[styles.cell, styles.header]}>Course</Text>
          <Text style={[styles.cell, styles.header]}>Duty</Text>
          <Text style={[styles.cell, styles.header]}>Remaining Hours</Text>
          <Text style={[styles.cell, styles.header]}>Duty Status</Text>
          <Text style={[styles.cell, styles.header]}>Status</Text>
          <Text style={[styles.cell, styles.header]}>Created</Text>
          <Text style={[styles.cell, styles.header]}>Last Updated</Text>
          <Text style={[styles.actionsCellHeader, styles.header]}>Actions</Text>
        </View>

        {/* Scholar Rows */}
        {scholars.map((s, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{s.name}</Text>
            <Text style={styles.cell}>{s.id}</Text>
            <Text style={styles.cell}>{s.email}</Text>
            <Text style={styles.cell}>{s.year}</Text>
            <Text style={styles.cell}>{s.course}</Text>
            <Text style={styles.cell}>{s.duty}</Text>
            <Text style={styles.cell}>{s.remainingHours ?? 0} hrs</Text>
            <Text style={styles.cell}>
              {s.remainingHours === 0 ? "✅ Completed" : "⏳ Not yet"}
            </Text>
            <Text
              style={[
                styles.cell,
                { color: s.status === "Deactivated" ? "#d9534f" : "green" },
              ]}
            >
              {s.status}
            </Text>
                <Text style={styles.cell}>
  {s.createdAt
    ? new Date(s.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—"}
</Text>

<Text style={styles.cell}>
  {s.updatedAt
    ? new Date(s.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—"}
</Text>

            {/* Actions */}
            <View style={styles.actionsCell}>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => onView(s)}
              >
                <Text style={styles.btnText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => onEdit(index)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  {
                    backgroundColor:
                      s.status === "Active" ? "#d9534f" : "green",
                  },
                ]}
                onPress={() => onToggleStatus(index)}
              >
                <Text style={styles.btnText}>
                  {s.status === "Active" ? "Deactivate" : "Re-Activate"}
                </Text>
              </TouchableOpacity>
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
    flexWrap: "wrap",
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
  statusBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default ScholarTable;
