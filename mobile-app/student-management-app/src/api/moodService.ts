import AsyncStorage from "@react-native-async-storage/async-storage";
import { dispatchApiCall } from "./wrapper/apiQueue";

export type MoodType = "happy" | "neutral" | "sad";

export const postMood = async (
  mood: MoodType,
  type: "checkin" | "checkout"
) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();
    if (!student_id) {
      throw new Error("Student ID not found");
    }

    return await dispatchApiCall({
      url: "/post-mood",
      method: "POST",
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: {
        emotion: mood,
        is_daily: type === "checkin" ? false : true,
        timestamp,
      },

    });
  } catch (error) {
    console.error("Error posting mood:", error);
    throw error;
  }
};
