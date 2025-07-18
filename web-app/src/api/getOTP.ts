import axios from "axios";
import { appConfig } from "../config/configs";
import { API_URL } from "../config/configs";

const API_KEY =
  appConfig.VITE_API_KEY ||
  (typeof process !== "undefined" ? process.env.API_KEY : undefined);

export async function getOTP(studentId: string | number) {
  try {
    const response = await axios.post(
      `${API_URL}/generate-otp`,
      {},
      {
        headers: {
          accept: "application/json",
          "student-id": String(studentId),
          "api-key": API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
