// TODO
// No need to send API KEY in headers for APIs
import axios from "axios";
import { API_URL } from "../config/configs";
import { appConfig } from "../config/configs";

export interface Attendance {
  check_in_date_time: string;
  check_out_date_time: string | null;
}

export interface Mood {
  emotion: string;
  recorded_at: string;
}

export interface EmployeeSummary {
  attendances: Attendance[];
  remarks: string;
  moods: Mood[];
}
const configs = (window as any).configs || {};
// Use import.meta.env for Vite or process.env for Node.js
const API_KEY =
  appConfig.VITE_API_KEY ||
  (typeof process !== "undefined" ? process.env.API_KEY : undefined);

export async function getEmployeeSummary(
  studentId: number
): Promise<EmployeeSummary> {
  const response = await axios.get<EmployeeSummary>(
    `${API_URL}/employee-summary`,
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
        "student-id": studentId.toString(),
      },
    }
  );
  return response.data;
}
