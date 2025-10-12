import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import ScholarDutyFormModal from "../components/ScholarDutyFormModal";
import ScholarDutyViewModal from "../components/ScholarDutyViewModal";
import DutyTable from "../components/DutyTable";
import axios from "axios";

const PRIMARY_COLOR = "#00A4DF";

export default function DutyManagement() {
  const [duties, setDuties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [viewDuty, setViewDuty] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    year: "",
    course: "",
    dutyType: "", // Initialize with empty string
    schedules: [{ day: "", startTime: "", endTime: "", room: "" }],
  });
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchDuties = async () => {
      try {
        const response = await axios.get("http://192.168.86.139:8000/api/duties");
        console.log("Fetched duties:", response.data);
        setDuties(response.data);
      } catch (error) {
        console.error("Error fetching duties:", error.response?.data || error.message);
        alert("Failed to load duties. Please try again.");
      }
    };
    fetchDuties();
  }, []);

  const validateScholarAccount = async (scholarId) => {
    console.log("Validating scholar ID:", scholarId);
    try {
      const response = await axios.get(`http://192.168.86.139:8000/api/scholars/${scholarId}`);
      console.log("Validation response:", JSON.stringify(response.data, null, 2));
      return response.data.exists === true; // Check the exists field
    } catch (error) {
      console.error("Validation error:", error.response?.status, error.message, error.response?.data);
      if (error.response?.status === 404) return false;
      return false;
    }
  };

  const saveDuty = async (duty, isEditing) => {
    console.log("Attempting to save duty - received duty:", duty); // Log the received duty
    if (!duty.id || !duty.dutyType || !duty.schedules?.length) {
      throw new Error("Scholar ID, duty type, and at least one schedule are required.");
    }

    const hasAccount = await validateScholarAccount(duty.id);
    console.log("Account validation result:", hasAccount);
    if (!hasAccount) {
      console.log("Throwing error for unknown account");
      throw new Error("Unknown account. Please register first."); // Throw error for no account
    }

    const dutiesToSave = duty.schedules.map((s) => ({
      name: duty.name,
      id: duty.id,
      year: duty.year,
      course: duty.course,
      dutyType: duty.dutyType, // Ensure dutyType is preserved
      day: s.day,
      time: `${s.startTime} - ${s.endTime}`,
      room: duty.dutyType === "Attendance Checker" ? "N/A" : s.room || "",
      status: "Active",
    }));

    console.log("Data sent to server:", dutiesToSave); // Log the data being sent

    try {
      const responses = await Promise.all(
        dutiesToSave.map((dutyItem) =>
          axios.post("http://192.168.86.139:8000/api/duties", dutyItem)
        )
      );
      const savedDuties = responses.map((r) => r.data);
      console.log("Saved duties:", savedDuties);

      if (isEditing && editIndex !== null) {
        const updated = [...duties];
        updated.splice(editIndex, 1, ...savedDuties);
        setDuties(updated);
      } else {
        setDuties((prevDuties) => [...prevDuties, ...savedDuties]);
      }

      return { success: true }; // Indicate success
    } catch (error) {
      console.error("Error saving duty:", error.response?.status, error.message, error.response?.data);
      throw error; // Re-throw to be caught by handleSave
    }
  };

  const handleIdChange = (id) => {
    console.log("ID changed to:", id);
    setFormData((prev) => ({ ...prev, id }));
    if (id.length === 14) {
      console.log("Fetching details for ID:", id);
      fetchScholarDetails(id);
    }
  };

  const fetchScholarDetails = async (scholarId) => {
    setIsLoading(true); // Start loading
    console.log("Fetching scholar details for:", scholarId);
    try {
      const response = await axios.get(`http://192.168.86.139:8000/api/scholars/${scholarId}`);
      console.log("Scholar details response:", JSON.stringify(response.data, null, 2));
      const { scholar } = response.data; // Destructure the nested object
      if (!scholar || typeof scholar !== "object") {
        throw new Error("Invalid scholar data received");
      }
      const validDutyTypes = ["Student Facilitator", "Attendance Checker"];
      const fetchedDutyType = scholar.duty || "Student Facilitator"; // Changed from scholar.dutyType to scholar.duty
      setFormData((prev) => ({
        ...prev,
        name: scholar.name || "",
        year: scholar.year || "",
        course: scholar.course || "",
        dutyType: validDutyTypes.includes(fetchedDutyType) ? fetchedDutyType : validDutyTypes[0], // Default to first valid type if mismatch
      }));
      if (!validDutyTypes.includes(fetchedDutyType)) {
        console.warn("Fetched duty type '", fetchedDutyType, "' is not in DUTY_TYPES. Defaulting to:", validDutyTypes[0]);
      }
    } catch (error) {
      console.error("Fetch scholar details error:", error.response?.status, error.message, error.response?.data);
      if (error.response?.status === 404) {
        setFormData((prev) => ({
          ...prev,
          name: "",
          year: "",
          course: "",
          dutyType: "", // Clear duty type on invalid ID
        }));
      } else {
        alert("Failed to fetch scholar details. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const filteredDuties = duties.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Duty Management</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => {
            setModalVisible(true);
            setEditIndex(null); // Explicitly reset editIndex for new assignment
            setFormData({
              id: "",
              name: "",
              year: "",
              course: "",
              dutyType: "",
              schedules: [{ day: "", startTime: "", endTime: "", room: "" }],
            }); // Reset formData for new assignment
          }}
        >
          <Text style={styles.btnText}>+ Assign Duty</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search duty..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <Text style={styles.sectionTitle}>
        Assigned Duties ({filteredDuties.length})
      </Text>

      <DutyTable
        duties={filteredDuties}
        onEdit={(index) => {
          setEditIndex(index);
          setModalVisible(true);
          setFormData({ ...duties[index], schedules: [{ day: "", startTime: "", endTime: "", room: "" }] });
        }}
        onView={(duty) => setViewDuty(duty)}
        onToggleStatus={(index) => {
          const updated = [...duties];
          const currentStatus = updated[index].status;
          updated[index].status =
            currentStatus === "Active" ? "Deactivated" : "Active";
          setDuties(updated);
        }}
      />

      <ScholarDutyFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditIndex(null);
          setFormData({
            id: "",
            name: "",
            year: "",
            course: "",
            dutyType: "",
            schedules: [{ day: "", startTime: "", endTime: "", room: "" }],
          });
        }}
        onSave={saveDuty}
        initialData={editIndex !== null ? { ...formData, schedules: [{ day: "", startTime: "", endTime: "", room: "" }] } : null} // Pass null for new duties
        onIdChange={handleIdChange} // Pass the ID change handler
        YEARS={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
        COURSES={[
          "BS ACCOUNTANCY",
          "BS HOSPITALITY MANAGEMENT",
          "BS TOURISM MANAGEMENT",
          "BSBA- MARKETING MANAGEMENT",
          "BSBA- BANKING & MICROFINANCE",
          "BACHELOR OF ELEMENTARY EDUCATION",
          "BSED- ENGLISH",
          "BSED- FILIPINO",
          "BS CRIMINOLOGY",
          "BS CIVIL ENGINEERING",
          "BS INFORMATION TECHNOLOGY",
          "BS NURSING",
        ]}
        DUTY_TYPES={["Student Facilitator", "Attendance Checker"]} // Current valid types
        DAYS={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
        TIMES={[
          "7:00 AM",
          "8:00 AM",
          "9:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "1:00 PM",
          "2:00 PM",
          "3:00 PM",
          "4:00 PM",
          "5:00 PM",
        ]}
        ROOMS={[
          "201", "202", "CL1", "CL2", "208", "209",
          "301", "302", "304", "305", "307", "308", "309",
          "401", "402", "403", "404", "405", "CL3", "CL4",
          "408", "409",
        ]}
      />

      <ScholarDutyViewModal
        duty={viewDuty}
        onClose={() => setViewDuty(null)}
        onDeactivate={(index) => {
          const updated = [...duties];
          updated.splice(index, 1);
          setDuties(updated);
          setViewDuty(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 30 },
  createBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 30,
  },
  btnText: { color: "white", fontWeight: "600" },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 8 },
});