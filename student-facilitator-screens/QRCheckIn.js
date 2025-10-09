import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const QRCheckIn = ({ scannedData }) => {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-add scanned QR data when received
  useEffect(() => {
    if (scannedData) {
      const newRecord = {
        id: scannedData.id || `NO-ID-${Date.now()}`,
        name: scannedData.name || "N/A",
        dutyType: scannedData.dutyType || "N/A",
        schedules: scannedData.schedules || [],
        status: scannedData.status || "Active",
        time: new Date().toLocaleString(),
      };

      // Prevent duplicates by ID
      setRecords((prev) => {
        const exists = prev.some((r) => r.id === newRecord.id);
        return exists ? prev : [newRecord, ...prev];
      });
    }
  }, [scannedData]);

  // Filter records by search input
  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 QR Check-In Records</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search by name or ID..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* Table Header */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerText]}>ID</Text>
        <Text style={[styles.cell, styles.headerText]}>Name</Text>
        <Text style={[styles.cell, styles.headerText]}>Duty</Text>
        <Text style={[styles.cell, styles.headerText]}>Status</Text>
        <Text style={[styles.cell, styles.headerText]}>Time</Text>
      </View>

      {/* Table Body */}
      <ScrollView>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((r, i) => (
            <View
              key={i}
              style={[
                styles.row,
                { backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff" },
              ]}
            >
              <Text style={styles.cell}>{r.id}</Text>
              <Text style={styles.cell}>{r.name}</Text>
              <Text style={styles.cell}>{r.dutyType}</Text>
              <Text style={styles.cell}>{r.status}</Text>
              <Text style={styles.cell}>{r.time}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No check-in records yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 15,
    marginTop: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#00A4DF",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
  },
  headerRow: {
    backgroundColor: "#00A4DF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
});

export default QRCheckIn;
