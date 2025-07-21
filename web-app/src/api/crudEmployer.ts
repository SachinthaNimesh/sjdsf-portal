import axios from "axios";
import { API_URL } from "@/config/configs";
import { appConfig } from "@/config/configs";

// Employer type definitions
export interface EmployerInput {
  name: string;
  contact_number: string;
  address_line1: string;
  address_line2?: string;
  address_line3: string;
  addr_long: number;
  addr_lat: number;
}

export interface Employer {
  id: number;
  name: string;
  contact_number: string;
  address_line1: string;
  address_line2?: string;
  address_line3: string;
  addr_long: number;
  addr_lat: number;
}

const API_KEY =
  appConfig.VITE_API_KEY ||
  (typeof process !== "undefined" ? process.env.API_KEY : undefined);

export function useEmployerService() {
  const getEmployers = async (): Promise<Employer[]> => {
    try {
      const response = await axios.get<Employer[]>(
        `${API_URL}/get-employer-ids`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching employers:", error);
      throw error;
    }
  };

  const getEmployerById = async (id: number): Promise<Employer> => {
    try {
      const response = await axios.get<Employer>(`${API_URL}/get-employer`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
          "employer-id": id,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching employer with id ${id}:`, error);
      throw error;
    }
  };

  const createEmployer = async (employer: EmployerInput): Promise<Employer> => {
    try {
      const response = await axios.post<Employer>(
        `${API_URL}/create-employer`,
        employer,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating employer:", error);
      throw error;
    }
  };

  const updateEmployer = async (
    id: number,
    employer: Partial<EmployerInput>
  ): Promise<Employer> => {
    try {
      const response = await axios.put<Employer>(
        `${API_URL}/update-employer`,
        employer,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY,
            "employer-id": id,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating employer with id ${id}:`, error);
      throw error;
    }
  };

  const deleteEmployer = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/delete-employer`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
          "employer-id": id,
        },
      });
    } catch (error) {
      console.error(`Error deleting employer with id ${id}:`, error);
      throw error;
    }
  };

  return {
    getEmployers,
    getEmployerById,
    createEmployer,
    updateEmployer,
    deleteEmployer,
  };
}
