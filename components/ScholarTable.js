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

const ScholarTable = ({ scholars = [], onEdit, onToggleStatus }) => {
  const { width: screenWidth } = useWindowDimensions();

  // ────── Column widths (same for header & body) ──────
  const COL_WIDTH = 140;           // enough for wrapped text
  const ACTION_WIDTH = 180;        // fits 2 buttons side-by-side
  const TOTAL_COLS = 11;
  const TABLE_MIN_WIDTH = TOTAL_COLS * COL_WIDTH + ACTION_WIDTH;

  // ────── Reusable cell with wrapping ──────
  const Cell = ({ children, style = {}, ...props }: any) => (
    <View style={[styles.cell, { width: COL_WIDTH, minWidth: COL_WIDTH }, style]} {...props}>
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

  // ────── Refs for scroll sync ──────
  const headerScrollRef = React.useRef<ScrollView>(null);
  const bodyScrollRef = React.useRef<ScrollView>(null);

  // ────── Header ──────
  const Header = () => (
    <View style={styles.headerRow}>
      <Cell style={styles.header}>Student</Cell>
      <Cell style={styles.header}>Student ID</Cell>
      <Cell style={styles.header}>Email</Cell>
      <Cell style={styles.header}>Year</Cell>
      <Cell style={styles.header}>Course</Cell>
      <Cell style={styles.header}>Duty</Cell>
      <Cell style={styles.header}>Remaining Hours</Cell>
      <Cell style={styles.header}>Duty Status</Cell>
      <Cell style={styles.header}>Status</Cell>
      <Cell style={styles.header}>Created</Cell>
      <Cell style={styles.header}>Last Updated</Cell>
      <ActionCell>
        <Text style={[styles.header, styles.actionHeader]}>Actions</Text>
      </ActionCell>
    </View>
  );

  // ────── Body ──────
  const Body = () => (
    <View>
      {scholars.map((s, idx) => (
        <View key={s._id || idx} style={styles.row}>
          <Cell>{s.name || "—"}</Cell>
          <Cell>{s.id || "—"}</Cell>
          <Cell>{s.email || "—"}</Cell>
          <Cell>{s.year || "—"}</Cell>
          <Cell>{s.course || "—"}</Cell>
          <Cell>{s.duty || "—"}</Cell>
          <Cell>{s.remainingHours ?? 0} hrs</Cell>
          <Cell>{s.remainingHours === 0 ? "Completed" : "Not yet"}</Cell>
          <Cell style={{ color: s.status === "Deactivated" ? "#d9534f" : "green" }}>
            {s.status || "—"}
          </Cell>
          <Cell>
            {s.createdAt
              ? new Date(s.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </Cell>
          <Cell>
            {s.updatedAt
              ? new Date(s.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </Cell>

          {/* Action Buttons – fit perfectly */}
          <ActionCell>
            <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(idx)}>
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusBtn,
                {
                  backgroundColor: s.status === "Active" ? "#d9534f" : "#28a745",
                },
              ]}
              onPress={() => onToggleStatus(s)}
            >
              <Text style={styles.btnText}>
                {s.status === "Active" ? "Deactivate" : "Re-Activate"}
              </Text>
            </TouchableOpacity>
          </ActionCell>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeaderWrapper}>
        <ScrollView
          ref={headerScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            bodyScrollRef.current?.scrollTo({
              x: e.nativeEvent.contentOffset.x,
              animated: false,
            });
          }}
        >
          <Header />
        </ScrollView>
      </View>

      {/* Scrollable Body */}
      <ScrollView
        ref={bodyScrollRef}
        style={styles.bodyScroll}
        horizontal={screenWidth < TABLE_MIN_WIDTH}
        showsHorizontalScrollIndicator={true}
        scrollEventThrottle={16}
        onScroll={(e) => {
          headerScrollRef.current?.scrollTo({
            x: e.nativeEvent.contentOffset.x,
            animated: false,
          });
        }}
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
  stickyHeaderWrapper: {
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    zIndex: 10,
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
    // Web + Mobile word break
    ...(Platform.OS === "web"
      ? { wordBreak: "break-word" }
      : { flexShrink: 1 }),
  },

  actionCell: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 6,
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

  // Buttons (fit in 180px)
  btnText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  editBtn: {
    backgroundColor: "#f0ad4e",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    minWidth: 60,
  },
  statusBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    minWidth: 80,
  },
});

export default ScholarTable;