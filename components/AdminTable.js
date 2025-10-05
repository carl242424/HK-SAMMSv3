import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const AdminTable = ({ admins, onDisable, onReactivate }) => {
  const [searchText, setSearchText] = useState("");

  // Filter admins based on search text
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchText.toLowerCase()) ||
      admin.id.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.wrapper}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or Employee ID..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Table */}
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.row, styles.header]}>
          <Text style={styles.cell}>Admin Name</Text>
          <Text style={styles.cell}>Employee ID</Text>
          <Text style={styles.cell}>Status</Text>
          <Text style={styles.cell}>Action</Text>
        </View>

        {/* Rows */}
        {filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{admin.name}</Text>
              <Text style={styles.cell}>{admin.id}</Text>
              <Text style={styles.cell}>{admin.status}</Text>

              <View style={styles.actionWrapper}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor:
                        admin.status === "Inactive" ? "#f0f0f0" : "#f8d7da",
                    },
                  ]}
                  onPress={() => onDisable(index)}
                  disabled={admin.status === "Inactive"}
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: admin.status === "Inactive" ? "#aaa" : "#721c24" },
                    ]}
                  >
                    Deactivate
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor:
                        admin.status === "Active" ? "#f0f0f0" : "#d4edda",
                    },
                  ]}
                  onPress={() => onReactivate(index)}
                  disabled={admin.status === "Active"}
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: admin.status === "Active" ? "#aaa" : "#155724" },
                    ]}
                  >
                    Reactivate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.row}>
            <Text style={{ flex: 1, textAlign: "center", color: "#666" }}>
              No admins found
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginTop: 15 },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  header: { backgroundColor: "#f5f5f5" },
  cell: { flex: 1, fontSize: 14 },
  actionWrapper: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
  },
  actionBtn: {
    padding: 6,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  btnText: { fontSize: 12, fontWeight: "600" },
});

export default AdminTable;
