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

const TIMES = [
  "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
];

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
    dutyType: "",
    schedules: [{ day: "", startTime: "", endTime: "", room: "" }],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDuties = async () => {
      try {
        const response = await axios.get("http://192.168.86.39:8000/api/duties");
        console.log("Fetched duties:", response.data);
        setDuties(response.data);
      } catch (error) {
        console.error("Error fetching duties:", error.response?.data || error.message);
        Alert.alert("Error", "Failed to load duties. Please try again.");
      }
    };
    fetchDuties();
  }, []);

  const validateScholarAccount = async (scholarId) => {
    console.log("Validating scholar ID:", scholarId);
    try {
      const response = await axios.get(`http://192.168.86.39:8000/api/scholars/${scholarId}`);
      console.log("Validation response:", JSON.stringify(response.data, null, 2));
      return response.data.exists === true;
    } catch (error) {
      console.error("Validation error:", error.response?.status, error.message, error.response?.data);
      return false;
    }
  };

  const doTimeRangesOverlap = (day1, start1, end1, day2, start2, end2) => {
    console.log(`Checking overlap: ${day1} ${start1}-${end1} vs ${day2} ${start2}-${end2}`);
    if (day1 !== day2) {
      console.log("No overlap: different days");
      return false;
    }
    const startIndex1 = TIMES.indexOf(start1);
    const endIndex1 = TIMES.indexOf(end1);
    const startIndex2 = TIMES.indexOf(start2);
    const endIndex2 = TIMES.indexOf(end2);
    if (startIndex1 === -1 || endIndex1 === -1 || startIndex2 === -1 || endIndex2 === -1) {
      console.log("No overlap: invalid time indices", { startIndex1, endIndex1, startIndex2, endIndex2 });
      return false;
    }
    const hasOverlap = startIndex1 < endIndex2 && startIndex2 < endIndex1;
    console.log(`Overlap result: ${hasOverlap}`);
    return hasOverlap;
  };

  const checkScheduleOverlap = (newSchedules, existingDuties, scholarId, isEditing) => {
    console.log("Checking database overlaps for schedules:", newSchedules);
    return newSchedules.some((newSched, index) => {
      console.log(`Checking new schedule ${index + 1}:`, newSched);
      if (!newSched.day || !newSched.startTime || !newSched.endTime) {
        console.log("Skipping incomplete schedule");
        return false;
      }
      return existingDuties.some((duty) => {
        if (isEditing && duty.id === scholarId) {
          console.log(`Skipping duty for same scholar (editing): ${duty.id}`);
          return false;
        }
        const [startTime, endTime] = duty.time.split(" - ");
        const overlap = doTimeRangesOverlap(
          newSched.day,
          newSched.startTime,
          newSched.endTime,
          duty.day,
          startTime,
          endTime
        );
        if (overlap) {
          console.log(`Overlap detected with duty: ${duty.day} ${duty.time} (ID: ${duty.id})`);
        }
        return overlap;
      });
    });
  };

  const saveDuty = async (duty, isEditing) => {
    console.log("Attempting to save duty:", duty);
    if (!duty.id || !duty.dutyType || !duty.schedules?.length) {
      throw new Error("Scholar ID, duty type, and at least one schedule are required.");
    }

    const hasAccount = await validateScholarAccount(duty.id);
    console.log("Account validation result:", hasAccount);
    if (!hasAccount) {
      console.log("Throwing error for unknown account");
      throw new Error("Unknown account. Please register first.");
    }

    // Check for overlaps with existing duties
    if (checkScheduleOverlap(duty.schedules, duties, duty.id, isEditing)) {
      console.log("Throwing overlap error");
      throw new Error("The selected schedule overlaps with another. Please choose a different time slot.");
    }

    const dutiesToSave = duty.schedules.map((s) => ({
      name: duty.name,
      id: duty.id,
      year: duty.year,
      course: duty.course,
      dutyType: duty.dutyType,
      day: s.day,
      time: `${s.startTime} - ${s.endTime}`,
      room: duty.dutyType === "Attendance Checker" ? "N/A" : s.room || "",
      status: "Active",
    }));

    console.log("Data to save:", dutiesToSave);

    try {
      if (isEditing && editIndex !== null) {
        // Delete existing duties for the scholar
        const existingDuties = duties.filter(d => d.id === duty.id);
        await Promise.all(
          existingDuties.map(d =>
            d._id ? axios.delete(`http://192.168.86.39:8000/api/duties/${d._id}`) : Promise.resolve()
          )
        );
        console.log("Deleted existing duties for scholar ID:", duty.id);
      }

      // Create new duties
      const responses = await Promise.all(
        dutiesToSave.map((dutyItem) =>
          axios.post("http://192.168.86.39:8000/api/duties", dutyItem)
        )
      );
      const savedDuties = responses.map((r) => r.data);
      console.log("Saved duties:", savedDuties);

      if (isEditing && editIndex !== null) {
        // Replace all duties for the scholar in the UI
        const updatedDuties = duties.filter(d => d.id !== duty.id);
        setDuties([...updatedDuties, ...savedDuties]);
      } else {
        setDuties((prevDuties) => [...prevDuties, ...savedDuties]);
      }

      return { success: true };
    } catch (error) {
      console.error("Error saving duty:", error.response?.status, error.message, error.response?.data);
      throw error;
    }
  };

  const handleIdChange = (id) => {
    console.log("ID changed to:", id);
    setFormData((prev) => ({ ...prev, id }));
    if (id.length === 14 && /^[0-9-]+$/.test(id)) {
      console.log("Fetching details for ID:", id);
      fetchScholarDetails(id);
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        year: "",
        course: "",
        dutyType: "",
      }));
    }
  };

  const fetchScholarDetails = async (scholarId) => {
    setIsLoading(true);
    console.log("Fetching scholar details for:", scholarId);
    try {
      const response = await axios.get(`http://192.168.86.39:8000/api/scholars/${scholarId}`);
      console.log("Scholar details response:", JSON.stringify(response.data, null, 2));
      if (!response.data.exists || !response.data.scholar) {
        throw new Error("Scholar not found");
      }
      const scholar = response.data.scholar;
      const validDutyTypes = ["Student Facilitator", "Attendance Checker"];
      const fetchedDutyType = scholar.duty && validDutyTypes.includes(scholar.duty) ? scholar.duty : validDutyTypes[0];
      const newFormData = {
        id: scholarId,
        name: scholar.name || "",
        year: scholar.year || "",
        course: scholar.course || "",
        dutyType: fetchedDutyType,
        schedules: formData.schedules, // Preserve existing schedules
      };
      setFormData(newFormData);
      console.log("Updated formData with scholar details:", newFormData);
    } catch (error) {
      console.error("Fetch scholar details error:", error.response?.status, error.message, error.response?.data);
      Alert.alert("Error", error.message === "Scholar not found" ? "Scholar not found. Please check the ID." : "Failed to fetch scholar details. Please try again.");
      setFormData((prev) => ({
        ...prev,
        name: "",
        year: "",
        course: "",
        dutyType: "",
      }));
    } finally {
      setIsLoading(false);
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
          // Load all schedules for the scholar
          const scholarDuties = duties.filter(d => d.id === duties[index].id);
          const schedules = scholarDuties.map(d => ({
            day: d.day,
            startTime: d.time.split(" - ")[0],
            endTime: d.time.split(" - ")[1],
            room: d.room,
          }));
          setFormData({
            ...duties[index],
            schedules: schedules.length > 0 ? schedules : [{ day: "", startTime: "", endTime: "", room: "" }],
          });
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
        initialData={formData}
        onIdChange={handleIdChange}
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
        DUTY_TYPES={["Student Facilitator", "Attendance Checker"]}
        DAYS={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
        TIMES={TIMES}
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