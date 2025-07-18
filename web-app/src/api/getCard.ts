import axios from "axios";
import { API_URL } from "../config/configs";
import { Card } from "../types/card";

export function useCardService() {
  const getCards = async (): Promise<Card[]> => {
    try {
      const response = await axios.get<Card[]>(`${API_URL}/dashboard`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });
      return response.data;
    } catch (error: any) {
      // if (axios.isAxiosError(error) && error.response?.status === 401) {
      //   // Handle unauthorized access, e.g., redirect to login
      //   window.location.href = "/auth/login";
      // }
      console.error("Error fetching cards:", error);
      throw error; // Re-throw the error for further handling
    }
  };

  return { getCards };
}
