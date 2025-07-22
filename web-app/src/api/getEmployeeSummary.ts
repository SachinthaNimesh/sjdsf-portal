import axios from "axios";
import { API_URL } from "../config/configs";
import { appConfig } from "../config/configs";

export interface StudentInfo {
  first_name: string;
  last_name: string;
  employer_name?: string; // Optional, if not available
  gender: string;
  contact_number: string;
  contact_number_guardian: string;
  remarks: string;
}

export interface Mood {
  // Define according to your backend's Mood model
  [key: string]: any;
}

export interface AttendanceRecord {
  scheduled_check_in: string;
  scheduled_check_out: string;
  actual_check_in: string;
  actual_check_out: string;
}

export interface TraineeProfileResponse {
  student_info: StudentInfo;
  recent_moods: Mood[];
  recent_attendance: AttendanceRecord[];
}
export async function getTraineeProfile(
  studentId: number
): Promise<TraineeProfileResponse> {
  const response = await axios.get<TraineeProfileResponse>(
    `${API_URL}/trainee-profile`,
    {
      headers: {
        accept: "application/json",
        "api-key": appConfig.VITE_API_KEY,
        "student-id": studentId.toString(),
      },
    }
  );
  return response.data;
}
