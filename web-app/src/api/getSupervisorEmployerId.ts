import axios from "axios";
import { API_URL } from "../config/configs";
import { appConfig } from "../config/configs";

// src/api/getSupervisorEmployerId.ts
console.log("TEST");
// Type definitions
type EmployerIDName = {
  id: number;
  name: string;
};

type SupervisorIDName = {
  supervisor_id: number;
  first_name: string;
  last_name: string;
};
const configs = (window as any).configs || {};
// Use import.meta.env for Vite or process.env for Node.js
const API_KEY =
  appConfig.VITE_API_KEY ||
  (typeof process !== "undefined" ? process.env.API_KEY : undefined);

export function useSupervisorEmployerService() {
  const getAllEmployerIDsAndNames = async (): Promise<EmployerIDName[]> => {
    try {
      const response = await axios.get<EmployerIDName[]>(
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
      console.error("Error fetching employer IDs and names:", error);
      throw error;
    }
  };

  const getAllSupervisorIDsAndNames = async (): Promise<SupervisorIDName[]> => {
    try {
      const response = await axios.get<SupervisorIDName[]>(
        `${API_URL}/get-supervisor-ids`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching supervisor IDs and names:", error);
      throw error;
    }
  };

  return { getAllEmployerIDsAndNames, getAllSupervisorIDsAndNames };
}
