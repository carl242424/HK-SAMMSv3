import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const DANGER_COLOR = "#FF5757";

export default function ScholarDutyViewModal({ duty, onClose, onDeactivate }) {
  return (
    <Modal visible={!!duty} transparent animationType="fade">
      <View style={styles.modalWrap}>
        <View style={styles.modalContent}>
          {duty && (
            <>
              <Text style={styles.modalTitle}>View Scholar Duty</Text>
              <Text>Name: {duty.name}</Text>
              <Text>ID: {duty.id}</Text>
              <Text>Year: {duty.year}</Text>
              <Text>Course: {duty.course}</Text>
              <Text>Duty Type: {duty.duty}</Text>

              <View style={styles.divider} />

              <Text style={styles.subHeader}>Assigned Schedules</Text>
              <ScrollView style={{ maxHeight: 200 }}>
                {duty.schedules?.map((sched, idx) => (
                  <View key={idx} style={styles.scheduleBox}>
                    <Text style={styles.scheduleTitle}>Schedule {idx + 1}</Text>
                    <Text>Day: {sched.day}</Text>
                    <Text>Time: {sched.startTime} - {sched.endTime}</Text>
                    {duty.duty !== "Attendance Checker" && (
                      <Text>Room: {sched.room}</Text>
                    )}
                  </View>
                ))}
              </ScrollView>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.deactivateBtn}
                  onPress={() => onDeactivate(duty.index)}
                >
                  <Text style={{ color: "white" }}>Deactivate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Text style={{ color: "white" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  subHeader: { fontWeight: "600", marginTop: 10, marginBottom: 5 },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginVertical: 8,
  },
  scheduleBox: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 8,
  },
  scheduleTitle: {
    fontWeight: "600",
    marginBottom: 3,
  },
  actions: {
    marginTop: 16,
  },
  deactivateBtn: {
    backgroundColor: DANGER_COLOR,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  closeBtn: {
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
});
