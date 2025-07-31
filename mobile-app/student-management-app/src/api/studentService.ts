import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config/config";

// Get student first name from API and cache it in AsyncStorage
export const getStudentFirstName = async (): Promise<string> => {
  try {
    let student_id = await AsyncStorage.getItem("student_id");
    if (!student_id) {
      throw new Error("Student ID not found");
    }
    student_id = student_id.trim();

    const url = `${BASE_URL}/get-student`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "student-id": student_id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to fetch student data:",
        response.status,
        errorText
      );
      throw new Error("Failed to fetch student data");
    }

    const data = await response.json();

    // Cache first name in AsyncStorage
    if (data.first_name) {
      await AsyncStorage.setItem("student_first_name", data.first_name);
    }

    return data.first_name ?? '';
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};

// Fetch and update check_out_time in AsyncStorage
export const updateCheckOutTime = async (): Promise<void> => {
  try {
    let student_id = await AsyncStorage.getItem("student_id");
    if (!student_id) {
      throw new Error("Student ID not found");
    }
    student_id = student_id.trim();

    const url = `${BASE_URL}/get-student`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "student-id": student_id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to fetch student data:",
        response.status,
        errorText
      );
      throw new Error("Failed to fetch student data");
    }

    const data = await response.json();


    if (data.check_out_time) {
      await AsyncStorage.setItem("check_out_time", data.check_out_time);

    }
  } catch (error) {
    // console.error("Error updating check_out_time:", error);
    // throw error;
  }
};
