import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";

const DutyTable = ({ duties = [], onEdit, onView, onToggleStatus }) => {
  const { width: screenWidth } = useWindowDimensions();

  // Fixed column widths
  const COL_WIDTH = 150;
  const ACTION_WIDTH = 240; // fits 3 buttons
  const TOTAL_COLS = 6;
  const TABLE_MIN_WIDTH = TOTAL_COLS * COL_WIDTH + ACTION_WIDTH;

  // Refs for horizontal scroll sync
  const headerScrollRef = React.useRef<ScrollView>(null);
  const bodyScrollRef = React.useRef<ScrollView>(null);

  // Reusable Cell with wrapping
  const Cell = ({ children, style = {} }: any) => (
    <View style={[styles.cell, { width: COL_WIDTH, minWidth: COL_WIDTH }, style]}>
      <Text style={styles.cellText} numberOfLines={3}>
        {children}
      </Text>
    </View>
  );

  const ActionCell = ({ children }: any) => (
    <View style={[styles.actionCell, { width: ACTION_WIDTH, minWidth: ACTION_WIDTH }]}>
      {children}
    </View>
  );

  // Sticky Header
  const StickyHeader = () => (
    <View style={styles.stickyHeaderContainer}>
      <ScrollView
        ref={headerScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) =>
          bodyScrollRef.current?.scrollTo({
            x: e.nativeEvent.contentOffset.x,
            animated: false,
          })
        }
      >
        <View style={styles.headerRow}>
          <Cell style={styles.header}>Student Name</Cell>
          <Cell style={styles.header}>Duty Type</Cell>
          <Cell style={styles.header}>Day</Cell>
          <Cell style={styles.header}>Time</Cell>
          <Cell style={styles.header}>Room</Cell>
          <Cell style={styles.header}>Status</Cell>
          <ActionCell>
            <Text style={[styles.header, styles.actionHeader]}>Actions</Text>
          </ActionCell>
        </View>
      </ScrollView>
    </View>
  );

  // Body Rows
  const Body = () => (
    <View>
      {duties.length > 0 ? (
        duties.map((duty, index) => (
          <View key={duty._id || index} style={styles.row}>
            <Cell>{duty.name || "N/A"}</Cell>
            <Cell>{duty.dutyType || "N/A"}</Cell>
            <Cell>{duty.day || "N/A"}</Cell>
            <Cell>{duty.time || "N/A"}</Cell>
            <Cell>
              {duty.room || (duty.dutyType === "Attendance Checker" ? "—" : "N/A")}
            </Cell>
            <Cell
              style={{
                color: duty.status === "Deactivated" ? "#d9534f" : "#28a745",
              }}
            >
              {duty.status || "Active"}
            </Cell>

            {/* Action Buttons – 3 different colors */}
            <ActionCell>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => onView?.(duty)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => onEdit?.(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  {
                    backgroundColor:
                      duty.status === "Active" ? "#dc3545" : "#28a745",
                  },
                ]}
                onPress={() => onToggleStatus?.(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>
                  {duty.status === "Active" ? "Deactivate" : "Re-Activate"}
                </Text>
              </TouchableOpacity>
            </ActionCell>
          </View>
        ))
      ) : (
        <View style={styles.row}>
          <Cell style={{ flex: 1, textAlign: "center" }}>No duties found</Cell>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <StickyHeader />

      {/* Scrollable Body */}
      <ScrollView
        ref={bodyScrollRef}
        style={styles.bodyScroll}
        horizontal={screenWidth < TABLE_MIN_WIDTH}
        showsHorizontalScrollIndicator={true}
        scrollEventThrottle={16}
        onScroll={(e) =>
          headerScrollRef.current?.scrollTo({
            x: e.nativeEvent.contentOffset.x,
            animated: false,
          })
        }
      >
        <View
          style={{
            minWidth: screenWidth < TABLE_MIN_WIDTH ? TABLE_MIN_WIDTH : "100%",
          }}
        >
          <Body />
        </View>
      </ScrollView>
    </View>
  );
};

/* ──────────────────────────────── Styles ──────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  // Sticky Header
  stickyHeaderContainer: {
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    zIndex: 100,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    paddingVertical: 10,
  },

  // Body
  bodyScroll: { flex: 1 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  // Cells
  cell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  cellText: {
    fontSize: 13,
    lineHeight: 18,
    ...(Platform.OS === "web" ? { wordBreak: "break-word" } : { flexShrink: 1 }),
  },

  actionCell: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 8,
  },

  // Header
  header: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#333",
  },
  actionHeader: {
    textAlign: "center",
    width: "100%",
  },

  // Action Buttons – Fixed Colors + Press Feedback
  btnText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  viewBtn: {
    backgroundColor: "#007bff", // Blue
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    minWidth: 60,
    opacity: 1, // Critical
  },
  editBtn: {
    backgroundColor: "#fd7e14", // Orange
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    minWidth: 60,
    opacity: 1,
  },
  statusBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    minWidth: 80,
    opacity: 1, // Critical for dynamic color
  },
});

export default DutyTable;