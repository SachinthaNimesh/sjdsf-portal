<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dispatchApiCall } from './wrapper/apiQueue';
=======
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config/config";

export type MoodType = "happy" | "neutral" | "sad";
>>>>>>> 149221675f231e631c41de857a65531e899f014b

export const postMood = async (
  mood: MoodType,
  type: "checkin" | "checkout"
) => {
  const timestamp = new Date().toISOString();
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    if (!student_id) {
      throw new Error("Student ID not found");
    }

<<<<<<< HEAD
    return await dispatchApiCall({
      url: '/post-mood',
      method: 'POST',
      headers: {
        accept: 'application/json',
        'student-id': student_id.trim(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emotion:mood,
        is_daily: type === 'checkin' ? false : true,
      }),
    });
=======
    const response = await fetch(`${BASE_URL}/post-mood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "student-id": student_id.trim(),
      },
      body: JSON.stringify({
        emotion: mood,
        is_daily: type === "checkin" ? false : true,
        timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post mood");
    }

    const data = await response.json();
    return data;
>>>>>>> 149221675f231e631c41de857a65531e899f014b
  } catch (error) {
    console.error("Error posting mood:", error);
    throw error;
<<<<<<< HEAD
  } 
};
=======
  }
};
>>>>>>> 149221675f231e631c41de857a65531e899f014b
