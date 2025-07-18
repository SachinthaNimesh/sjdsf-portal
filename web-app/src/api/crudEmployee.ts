import axios from "axios";
import { API_URL } from "../config/configs";
import { appConfig } from "../config/configs";

// Student type definition
export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  dob: string; // ISO string
  gender: string;
  address_line1: string;
  address_line2: string;
  city: string;
  contact_number: string;
  contact_number_guardian: string;
  supervisor_id?: number | null;
  remarks: string;
  home_long: number;
  home_lat: number;
  employer_id?: number | null;
  check_in_time: string;
  check_out_time: string;
}

const API_KEY =
  appConfig.VITE_API_KEY ||
  (typeof process !== "undefined" ? process.env.API_KEY : undefined);

export function useStudentService() {
  const getStudents = async (): Promise<Student[]> => {
    try {
      const response = await axios.get<Student[]>(`${API_URL}/student`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  };

  const getStudentById = async (id: number): Promise<Student> => {
    try {
      const response = await axios.get<Student>(`${API_URL}/get-student`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
          "student-id": id,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with id ${id}:`, error);
      throw error;
    }
  };

  const createStudent = async (
    student: Omit<Student, "id">
  ): Promise<Student> => {
    try {
      const response = await axios.post<Student>(
        `${API_URL}/create-employee`,
        student,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  };

  const updateStudent = async (
    id: number,
    student: Partial<Student>
  ): Promise<Student> => {
    try {
      const response = await axios.put<Student>(
        `${API_URL}/update-employee`,
        student,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY,
            "student-id": id,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating student with id ${id}:`, error);
      throw error;
    }
  };

  const deleteStudent = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/delete-employee`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
          "student-id": id,
        },
      });
    } catch (error) {
      console.error(`Error deleting student with id ${id}:`, error);
      throw error;
    }
  };

  return {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}
