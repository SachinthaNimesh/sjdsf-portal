import axios from "axios";
import { Supervisor } from "@/types/supervisor";
import { API_URL } from "../config/configs";

// Get all supervisors
export async function getAllSupervisors(): Promise<Supervisor[]> {
  console.log("Calling GET /get-supervisors");
  const res = await axios.get(`${API_URL}/get-supervisors`);
  console.log("Response from /get-supervisors:", res.data);
  return res.data;
}

// Get supervisor by ID
export async function getSupervisorById(id: number): Promise<Supervisor> {
  console.log("Calling GET /get-supervisor with id:", id);
  const res = await axios.get(`${API_URL}/get-supervisor`, {
    headers: { "supervisor-id": String(id) },
  });
  console.log("Response from /get-supervisor:", res.data);
  return res.data;
}

// Create supervisor
export async function createSupervisor(
  data: Omit<Supervisor, "supervisor_id">
): Promise<Supervisor> {
  console.log("Calling POST /create-supervisor with data:", data);
  const res = await axios.post(`${API_URL}/create-supervisor`, data);
  console.log("Response from /create-supervisor:", res.data);
  return res.data;
}

// Update supervisor
export async function updateSupervisor(
  id: number,
  data: Omit<Supervisor, "supervisor_id">
): Promise<Supervisor> {
  console.log("Calling PUT /update-supervisor with id:", id, "and data:", data);
  const res = await axios.put(`${API_URL}/update-supervisor`, data, {
    headers: { "supervisor-id": String(id) },
  });
  console.log("Response from /update-supervisor:", res.data);
  return res.data;
}

// Delete supervisor
export async function deleteSupervisor(id: number): Promise<void> {
  console.log("Calling DELETE /delete-supervisor with id:", id);
  const res = await axios.delete(`${API_URL}/delete-supervisor`, {
    headers: { "supervisor-id": String(id) },
  });
  console.log("Response from /delete-supervisor:", res.status);
}

// Hook for Supervisor CRUD
export function useSupervisorService() {
  return {
    getAllSupervisors,
    getSupervisorById,
    createSupervisor,
    updateSupervisor,
    deleteSupervisor,
  };
}
