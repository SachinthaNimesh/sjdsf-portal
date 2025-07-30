import AsyncStorage from "@react-native-async-storage/async-storage";
import { dispatchApiCall } from "./wrapper/apiQueue";

export const postCheckIn = async (latitude: number, longitude: number) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();
    if (!student_id) {
      throw new Error("Student ID not found");
    }

    return await dispatchApiCall({
      url: "/attendance",
      method: "POST",
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: {
        check_in: true,
        check_in_lat: latitude,
        check_in_long: longitude,
        timestamp,
      },

    });
  } catch (error) {
    console.error("Error posting check-in:", error);
    throw error;
  }
};

export const postCheckOut = async (latitude: number, longitude: number) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();

    if (!student_id) {
      throw new Error("Student ID not found");
    }

    return await dispatchApiCall({
      url: "/attendance",
      method: "POST",
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: {
        check_in: false,
        check_in_lat: latitude,
        check_in_long: longitude,
        timestamp,
      },
    });
  } catch (error) {
    console.error("Error posting check-out:", error);
    throw error;
  }
};

