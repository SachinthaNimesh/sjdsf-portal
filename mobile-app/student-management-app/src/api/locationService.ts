// This file is not being used in the current implementation.

import { useState, useCallback } from "react";
import * as Location from "expo-location";

type UseLocationOptions = {
  enableRetry?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
};

export const useLocation = (options: UseLocationOptions = {}) => {
  const { enableRetry = false, maxRetries = 10 } = options;

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
      setLoading(false);
      return false;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLoading(false);
      setError(null);
      console.log("Location fetched successfully:", location.coords);
      return true;
    } catch (e: any) {
      setError(e?.message || "Failed to get location");
      setLoading(false);
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    let attempts = 0;
    let success = false;
    while (!success && (enableRetry ? attempts < maxRetries : attempts < 1)) {
      success = await getCurrentLocation();
      attempts++;
      if (!success && enableRetry) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
    return success;
  }, [enableRetry, maxRetries, getCurrentLocation]);

  return {
    latitude,
    longitude,
    loading,
    error,
    refreshLocation,
  };
};