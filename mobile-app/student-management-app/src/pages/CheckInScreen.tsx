// TODO seems like locationFetching happends twice
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLocation } from "../api/locationService";
import { postCheckIn } from "../api/attendanceService";
import NetInfo, { refresh } from "@react-native-community/netinfo";

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
  const [showWelcome, setShowWelcome] = useState(true);
  const [showNoInternet, setShowNoInternet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showWelcome) return;

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
  }, [showWelcome]);

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

      await refreshLocation();

      const start = Date.now();
      const timeout = 15000; // 15 seconds

      while (
        (latitude == null || longitude == null) &&
        Date.now() - start < timeout
      ) {
        await new Promise((res) => setTimeout(res, 300)); // Wait for 300ms before retrying
      }

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
        setError("Can not fetch location.");
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
  }, [latitude, longitude, loading, navigation]);

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

  if (showWelcome) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.container,
          { backgroundColor: "#667eea", zIndex: 999 },
        ]}
      >
        <Text style={styles.welcomeText} accessibilityRole="header">
          Welcome!
        </Text>
        <View style={{ marginTop: 30 }} />
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth: 6,
            borderColor: "#fff",
            borderTopColor: "#ff6b6b",
            alignSelf: "center",
            marginBottom: 10,
          }}
        />
      </View>
    );
  }

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
          style={[styles.checkinButton, loading && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Check In"
        >
          <Text style={styles.buttonText}>{loading ? "Loading..." : "In"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#667eea",
    padding: 20,
  },
  welcomeText: {
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 25,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#667eea",
  },
  locationInfo: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2c3e50",
  },
  checkinButton: {
    width: "100%",
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#27ae60",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  noInternetCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    minWidth: 260,
    maxWidth: 320,
    zIndex: 2,
  },
  noInternetEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  noInternetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  noInternetMsg: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  noInternetWait: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
});

export default CheckInScreen;
