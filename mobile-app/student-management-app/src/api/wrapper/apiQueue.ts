import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { BASE_URL } from "../../../config/config";

let isFlushing = false;

type QueuedRequest = {
  url: string;
  method: "POST";
  headers: Record<string, string>;
  body: any;
  timestamp: string;
};

const QUEUE_KEY = "apiQueue";

export const dispatchApiCall = async (
  req: Omit<QueuedRequest, "timestamp">
) => {
  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);

  const fullReq: QueuedRequest = {
    ...req,
    timestamp: new Date().toISOString(),
  };

  if (isConnected && !isFlushing) {
    // Flush existing queue first
    await flushQueue();
    // Send the request
    return await sendRequest(fullReq);
  } else {
    // Offline: store request in queue
    const current = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: QueuedRequest[] = current ? JSON.parse(current) : [];
    queue.push(fullReq);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log("Request queued:", fullReq);
  }
};

const sendRequest = async (req: QueuedRequest) => {
  try {
    const res = await fetch(`${BASE_URL}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
    });

    if (!res.ok) {
      const isClientError = res.status >= 400 && res.status < 500;
      if (isClientError) {
        throw new Error(`Client error, not retrying: ${res.status}`);
      } else {
        throw new Error(`Server error: ${res.status}`);
      }
    }
    return await res.json();
  } catch (error) {
    console.error("Error sending request:", error);
    throw error;
  }
};

export const flushQueue = async () => {
  if (isFlushing) return; // Prevent concurrent flushes
  isFlushing = true;

  try {
    const current = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: QueuedRequest[] = current ? JSON.parse(current) : [];

    const newQueue = [];

    for (const req of queue) {
      try {
        await sendRequest(req);
      } catch (error) {
        // console.error("Error processing queued request:", error);
        // Keep failed requests in the new queue
        newQueue.push(req);
      }
    }
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  } catch (error) {
    // console.error("Error flushing queue:", error);
  } finally {
    isFlushing = false;
  }
};
