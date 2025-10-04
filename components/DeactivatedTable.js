import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DANGER_COLOR = "#FF5757";

export default function DeactivatedTable({ deactivated, onReactivate }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Deactivated Accounts</Text>
      {deactivated.map((s, i) => (
        <View key={i} style={styles.deactivatedCard}>
          <Text>{s.name} ({s.id})</Text>
          <Text style={{ color: DANGER_COLOR }}>Status: {s.status}</Text>
          <TouchableOpacity style={styles.reactivateBtn} onPress={() => onReactivate(i)}>
            <Text style={{ color: "white" }}>Re-activate</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
  deactivatedCard: { borderWidth: 1, borderColor: DANGER_COLOR, borderRadius: 8, padding: 12, marginVertical: 6 },
  reactivateBtn: { backgroundColor: "green", padding: 6, borderRadius: 6, marginTop: 6, alignItems: "center" },
});
