<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dispatchApiCall } from './wrapper/apiQueue';
=======
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config/config";
>>>>>>> 149221675f231e631c41de857a65531e899f014b

export const postCheckIn = async (latitude: number, longitude: number) => {
  try {
    const student_id = await AsyncStorage.getItem("student_id");
    const timestamp = new Date().toISOString();
    if (!student_id) {
      throw new Error("Student ID not found");
    }

<<<<<<< HEAD
    return await dispatchApiCall({
      url: '/attendance',
      method: 'POST',
=======
    const response = await fetch(`${BASE_URL}/attendance`, {
      method: "POST",
>>>>>>> 149221675f231e631c41de857a65531e899f014b
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        check_in: true,
        check_in_lat: latitude,
        check_in_long: longitude,
        timestamp,
      }),
    });
<<<<<<< HEAD
=======

    if (!response.ok) {
      throw new Error("Failed to post check-in");
    }
    // check response code -> if 400 range ignore , 200 range return data
    const data = await response.json();
    return data;
>>>>>>> 149221675f231e631c41de857a65531e899f014b
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

<<<<<<< HEAD
    return await dispatchApiCall({
      url: '/attendance',
      method: 'POST',
=======
    const response = await fetch(`${BASE_URL}/attendance`, {
      method: "POST",
>>>>>>> 149221675f231e631c41de857a65531e899f014b
      headers: {
        accept: "application/json",
        "student-id": student_id.trim(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        check_in: false,
<<<<<<< HEAD
        check_out_lat: latitude,
        check_out_long: longitude,
      }),
    });
=======
        check_in_lat: latitude, // Use check_in_lat for check-out
        check_in_long: longitude,
        timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post check-out");
    }

    const data = await response.json();
    return data;
>>>>>>> 149221675f231e631c41de857a65531e899f014b
  } catch (error) {
    console.error("Error posting check-out:", error);
    throw error;
  }
};
