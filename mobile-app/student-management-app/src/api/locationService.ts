import { useState, useEffect, useCallback, useRef } from "react";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";
import { LocationInfo, UseLocationOptions } from "../types/location";

export const useLocation = (options: UseLocationOptions = {}) => {
    const { enableRetry = false, maxRetries = 5, timeoutMs = 3000 } = options;

    const [locationInfo, setLocationInfo] = useState<LocationInfo>({
        latitude: null,
        longitude: null,
        loading: true,
        error: null,
    });

    const retryCountRef = useRef(0);
    const timeoutRef = useRef<any | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Check permissions and location services
    const checkPermissionsAndServices = useCallback(async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            return {
                permissionsGranted: false,
                error: "Permission to access location was denied",
            };
        }

        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            Alert.alert("Location Disabled", "Please enable location services in your device settings.", [
                { text: "Open Settings", onPress: () => Linking.openSettings() },
            ]);
            return {
                permissionsGranted: true,
                servicesEnabled: false,
                error: "Location services are disabled",
            };
        }

        return { permissionsGranted: true, servicesEnabled: true, error: null };
    }, []);

    // Get location with timeout and abort capability
    const getLocationWithTimeout = useCallback(async () => {
        try {
            const permissionCheck = await checkPermissionsAndServices();
            if (!permissionCheck.permissionsGranted || !permissionCheck.servicesEnabled) {
                setLocationInfo({
                    latitude: null,
                    longitude: null,
                    loading: false,
                    error: permissionCheck.error,
                });
                return false;
            }

            // Create new abort controller for this attempt
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            // Set timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            let locationRetrieved = false;
            const timeoutPromise = new Promise<false>((resolve) => {
                timeoutRef.current = setTimeout(() => {
                    if (!locationRetrieved) {
                        resolve(false);
                    }
                }, timeoutMs);
            });

            // Get location
            const locationPromise = (async () => {
                try {
                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });

                    locationRetrieved = true;
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);

                    setLocationInfo({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        loading: false,
                        error: null,
                    });

                    return true;
                } catch (error) {
                    if ((error as any)?.message !== "Location request timed out") {
                        setLocationInfo({
                            latitude: null,
                            longitude: null,
                            loading: false,
                            error: error instanceof Error ? error.message : "An unknown error occurred",
                        });
                    }
                    return false;
                }
            })();

            return await Promise.race([locationPromise, timeoutPromise]);
        } catch (error) {
            setLocationInfo({
                latitude: null,
                longitude: null,
                loading: false,
                error: error instanceof Error ? error.message : "An unknown error occurred",
            });
            return false;
        }
    }, [checkPermissionsAndServices, timeoutMs]);

    const retryGetLocation = useCallback(async () => {
        setLocationInfo((prev) => ({ ...prev, loading: true, error: null }));
        retryCountRef.current = 0;

        const attemptLocation = async (): Promise<boolean> => {
            if (retryCountRef.current >= maxRetries) {
                setLocationInfo({
                    latitude: null,
                    longitude: null,
                    loading: false,
                    error: `Failed to get location after ${maxRetries} attempts`,
                });
                return false;
            }

            const success = await getLocationWithTimeout();
            if (success) {
                return true;
            }

            retryCountRef.current++;
            console.log(`Location attempt ${retryCountRef.current} failed, retrying...`);
            return attemptLocation();
        };

        return enableRetry ? attemptLocation() : getLocationWithTimeout();
    }, [enableRetry, getLocationWithTimeout, maxRetries]);

    const refreshLocation = useCallback(async () => {
        return retryGetLocation();
    }, [retryGetLocation]);

    useEffect(() => {
        let mounted = true;

        const getInitialLocation = async () => {
            try {
                const permissionCheck = await checkPermissionsAndServices();
                if (!permissionCheck.permissionsGranted || !permissionCheck.servicesEnabled) {
                    if (mounted) {
                        setLocationInfo((prev) => ({
                            ...prev,
                            loading: false,
                            error: permissionCheck.error,
                        }));
                    }
                    return;
                }

                if (enableRetry) {
                    await retryGetLocation();
                } else {
                    await getLocationWithTimeout();
                }
            } catch (error) {
                if (mounted) {
                    console.error("Location Error details: ", {
                        message: error instanceof Error ? error.message : String(error),
                        code: error instanceof Error && "code" in error ? (error as any).code : undefined,
                        type: typeof error,
                    });

                    setLocationInfo({
                        latitude: null,
                        longitude: null,
                        loading: false,
                        error: error instanceof Error ? error.message : "An unknown error occurred",
                    });
                }
            }
        };

        getInitialLocation();

        return () => {
            mounted = false;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [checkPermissionsAndServices, enableRetry, getLocationWithTimeout, retryGetLocation]);

    return {
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude,
        loading: locationInfo.loading,
        error: locationInfo.error,
        refreshLocation,
    };
};
