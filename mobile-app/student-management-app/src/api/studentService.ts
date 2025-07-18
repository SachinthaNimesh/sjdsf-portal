import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config/config";

export const getStudentById = async () => {
  try {
    let student_id = await AsyncStorage.getItem("student_id");
    if (!student_id) {
      throw new Error("Student ID not found");
    }
    student_id = student_id.trim();
    console.log("Fetched student_id from AsyncStorage:", student_id);

    const url = `${BASE_URL}/get-student`;
    console.log("Fetching student data from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "student-id": student_id,
        "api-key": String(process.env.EXPO_PUBLIC_API_KEY ?? ""),
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

    // Get check_out_time from AsyncStorage
    const storedCheckOutTime = await AsyncStorage.getItem("check_out_time");

    // // If backend check_out_time is present and different, update AsyncStorage
    if (data.check_out_time && data.check_out_time !== storedCheckOutTime) {
      await AsyncStorage.setItem("check_out_time", data.check_out_time);
    } else if (!data.check_out_time && storedCheckOutTime) {
      // If backend check_out_time is missing, use the stored value
      data.check_out_time = storedCheckOutTime;
    }
    return data;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};
