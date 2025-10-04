import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DANGER_COLOR = "#FF5757";

export default function ScholarViewModal({ scholar, onClose, onDeactivate }) {
  return (
    <Modal visible={!!scholar} transparent animationType="fade">
      <View style={styles.modalWrap}>
        <View style={styles.modalContent}>
          {scholar && (
            <>
              <Text style={styles.modalTitle}>View Scholar</Text>
              <Text>Name: {scholar.name}</Text>
              <Text>ID: {scholar.id}</Text>
              <Text>Year: {scholar.year}</Text>
              <Text>Course: {scholar.course}</Text>
              <Text>Duty: {scholar.duty}</Text>
              <Text>Duty Remaining Hours: 55 hrs</Text>

              <TouchableOpacity style={styles.deactivateBtn} onPress={() => onDeactivate(scholar.index)}>
                <Text style={{ color: "white" }}>Deactivate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={{ color: "white" }}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrap: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 16 },
  modalContent: { backgroundColor: "white", borderRadius: 8, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  deactivateBtn: { backgroundColor: DANGER_COLOR, padding: 10, borderRadius: 6, marginTop: 12, alignItems: "center" },
  closeBtn: { backgroundColor: "#999", padding: 10, borderRadius: 6, marginTop: 12, alignItems: "center" },
});
