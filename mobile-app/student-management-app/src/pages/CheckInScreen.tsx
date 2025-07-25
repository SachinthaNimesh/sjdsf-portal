// TODO seems like locationFetching happends twice
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLocation } from "../api/locationService";
import { postCheckIn } from "../api/attendanceService";
import NetInfo from "@react-native-community/netinfo";
import styles from "./CheckInScreen.styles"; // Assuming styles are defined in a separate file
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CheckInScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    time: "",
    period: "",
    day: "",
    month: "",
    fullDate: "",
  });

  const {
    latitude,
    longitude,
    loading: locationLoading,
    refreshLocation,
  } = useLocation({
    enableRetry: true,
    maxRetries: 5,
    timeoutMs: 5000,
  });
  // const [showWelcome, setShowWelcome] = useState(true);
  const [showNoInternet, setShowNoInternet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowWelcome(false), 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    // if (showWelcome) return;

    const updateDateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const day = now.getDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[now.getMonth()];
      const fullDate = `${month} ${day}, ${now.getFullYear()}`;

      setCurrentDateTime({
        time: `${hours}:${minutes}`,
        period,
        day: day.toString(),
        month,
        fullDate,
      });
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);// removed showWelcome dependancy

  useEffect(() => {
    if (!showNoInternet) return;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setShowNoInternet(false);
      }
    });
    return () => unsubscribe();
  }, [showNoInternet]);

  const handleCheckIn = useCallback(async () => {
    if (loading) return; // Prevent multiple check-ins
    try {
      setLoading(true);
      setError(null);

      console.log('Refreshing Location...')
      await refreshLocation();

      // const start = Date.now();
      // const timeout = 1000; // 1 second

      // while (
      //   (latitude == null || longitude == null) &&
      //   Date.now() - start < timeout
      // ) {
      //   await new Promise((res) => setTimeout(res, 300)); // Wait for 300ms before retrying
      // }

      console.log(
        "latitude#:",
        latitude,
        "longitude#:",
        longitude,
        "loading#:",
        locationLoading
      );

      if (latitude == null || longitude == null) {
        setLoading(false);
        setError("Please try again.");
        return;
      }
      await postCheckIn(latitude, longitude);
      navigation.replace("WelcomeGreeting");
    } catch (error: any) {
      // Show popup if network/connection error
      if (
        typeof error?.message === "string" &&
        (error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("internet") ||
          error.message.toLowerCase().includes("connection") ||
          error.message.toLowerCase().includes("failed to fetch"))
      ) {
        setShowNoInternet(true);
      } else {
        console.error("An error occurred during check-in:", error);
        setError(
          error instanceof Error ? error.message : "Error check-in. Try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [longitude, latitude, loading, navigation]);

  useEffect(() => {
    if (error) {
      alert(error);
      setError(null);
    }
  }, [error]);

  // useEffect(()=> {
  //   refreshLocation();
  //   console.log("latitude:", latitude, "longitude:", longitude, "loading:", locationLoading);
  // }, [latitude, longitude, locationLoading]);

  const Loader = () => {
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => animation.stop();
    }, [rotateAnim]);

    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <View style={{ alignItems: "center", justifyContent: "center", height: 50 }}>
        <Animated.View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            transform: [{ rotate: spin }],
          }}
        >
          {/* Arc (partial circle) */}
          <View
            style={styles.loaderArc}
          />
          {/* Orange dot at the top */}
          <View
            style={styles.loadLocationContainer}
          />
        </Animated.View>
      </View>
    );
  };
  if (showNoInternet) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.container,
          {
            zIndex: 999,
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
          },
        ]}
      >
        {/* Fullscreen overlay card */}
        <View />
        {/* Centered popup card */}
        <View
          style={styles.noInternetCard}
          accessibilityRole="alert"
          accessibilityLabel="No Internet Connection"
        >
          <Text style={styles.noInternetEmoji}>🛜</Text>
          <Text style={styles.noInternetTitle}>No Internet Connection</Text>
          <Text style={styles.noInternetMsg}>
            Turn Mobile Data or Wifi On 🛜
          </Text>
          <Text style={styles.noInternetWait}>Waiting for connection...</Text>
        </View>
      </View>
    );
  }

  // if (showWelcome) {
  //   return (
  //     <View
  //       style={[
  //         StyleSheet.absoluteFill,
  //         styles.container,
  //         { backgroundColor: "#667eea", zIndex: 999 },
  //       ]}
  //     >
  //       <Text style={styles.welcomeText} accessibilityRole="header">
  //         Welcome!
  //       </Text>
  //       <View style={{ marginTop: 30 }} />
  //       <View
  //         style={styles.loadingContainer}
  //       />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title} accessibilityRole="header">
          Check In
        </Text>
        <View style={styles.locationInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>🕐</Text>
            <Text style={styles.infoText}>
              {currentDateTime.time} {currentDateTime.period}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.infoText}>{currentDateTime.fullDate}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.checkinButton,
            (loading || locationLoading) && styles.buttonDisabled
          ]}
          onPress={handleCheckIn}
          disabled={loading || locationLoading}
          accessibilityRole="button"
          accessibilityLabel="Check In"
        >
          {locationLoading || latitude == null || longitude == null ? (
            <Loader />
          ) : (
            <Text style={styles.buttonText}>
              IN
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckInScreen;
