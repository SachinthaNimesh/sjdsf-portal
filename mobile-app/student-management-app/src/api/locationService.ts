import { useState, useEffect, useCallback } from "react";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

export interface LocationInfo {
  latitude: number | null;
  longitude: number | null;
}

export const useLocation = () => {
  const [locationInfo, setLocationInfo] = useState<{
    coords: Location.LocationObjectCoords | null;
    loading: boolean;
    error: string | null;
    latitude: number | null;
    longitude: number | null;
  }>({
    coords: null,
    loading: true,
    error: null,
    latitude: null,
    longitude: null,
  });

  // Refresh location
  const refreshLocation = useCallback(async () => {
    setLocationInfo((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationInfo((prev) => ({
          ...prev,
          loading: false,
          error: "Permission to access location was denied",
        }));
        return;
      }

      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          "Location Disabled",
          "Please enable location services in your device settings.",
          [{ text: "Open Settings", onPress: () => Linking.openSettings() }]
        );
        return;
      }

      // Get fresh location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocationInfo({
        coords: location.coords,
        loading: false,
        error: null,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      setLocationInfo((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }, []);
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const getDeviceLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationInfo((prev) => ({
            ...prev,
            loading: false,
            error: "Permission to access location was denied",
          }));
          return;
        }

        // Check if location services are enabled
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          Alert.alert(
            "Location Disabled",
            "Please enable location services in your device settings.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 50,
          },
          (deviceLocation) => {
            setLocationInfo({
              coords: deviceLocation.coords,
              loading: false,
              error: null,
              latitude: deviceLocation.coords.latitude,
              longitude: deviceLocation.coords.longitude,
            });

            console.log("Latitude:", deviceLocation.coords.latitude);
            console.log("Longitude:", deviceLocation.coords.longitude);
          }
        );
      } catch (error) {
        console.error("Location Error details: ", {
          message: error instanceof Error ? error.message : String(error),
          code:
            error instanceof Error && "code" in error
              ? (error as any).code
              : undefined,
          type: typeof error,
        });
        setLocationInfo((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        }));
      }
    };

    getDeviceLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return {
    latitude: locationInfo.latitude,
    longitude: locationInfo.longitude,
    refreshLocation,
  };
};
