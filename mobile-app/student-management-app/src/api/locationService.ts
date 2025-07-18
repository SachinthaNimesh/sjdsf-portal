import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

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

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const getDeviceLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationInfo(prev => ({
            ...prev,
            loading: false,
            error: 'Permission to access location was denied',
          }));
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, timeInterval: 1000*60, distanceInterval: 10 },
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
        console.error("Error getting location: ", error);
        setLocationInfo(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred',
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

  return { latitude: locationInfo.latitude, longitude: locationInfo.longitude };
}; 