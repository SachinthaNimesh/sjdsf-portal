import { API_URL } from "../config/configs";
export type FeedbackResponse = {
  [key: string]: string;
};

export async function getManagerFeedback(): Promise<FeedbackResponse[]> {
  const res = await fetch(`${API_URL}/manager-feedback`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch manager feedback: ${res.status} ${res.statusText}`
    );
  }
  return await res.json();
}
