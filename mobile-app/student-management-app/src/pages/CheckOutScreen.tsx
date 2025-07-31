import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { postCheckOut } from "../api/attendanceService";
import NetInfo from "@react-native-community/netinfo";
import LottieView from 'lottie-react-native';
import { getCurrentLocationOnce } from "../utils/location";
import styles from "./CheckOutScreen.styles";
import Loader from "../components/Loader";
import OfflineNotice from "../components/OfflineNotice";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CheckOutScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showNoInternet, setShowNoInternet] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!showNoInternet) return;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setShowNoInternet(false);
      }
    });
    return () => unsubscribe();
  }, [showNoInternet]);

  const handleCheckOut = async () => {
    if (loading) return; // Prevent multiple submissions
    try {
      setLoading(true);

      const {latitude, longitude} = await getCurrentLocationOnce();

      if (latitude == null || longitude == null) {
        setLoading(false);
        Alert.alert(
          "Location Unavailable",
          "Location data is not available. Please enable location services and try again."
        );
        return;
      }

      await postCheckOut(latitude, longitude);
      if (isMounted.current) {
        navigation.replace("Feedback");
      }
    } catch (error: any) {
      if (
        typeof error?.message === "string" &&
        (error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("internet") ||
          error.message.toLowerCase().includes("connection") ||
          error.message.toLowerCase().includes("failed to fetch"))
      ) {
        setShowNoInternet(true);
      } else {
        console.error("An error occurred during check-out:", error);
        Alert.alert(
          "Check-out Error",
          error instanceof Error
            ? error.message
            : "An error occurred during check-out. Please try again."
        );
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  if (showNoInternet) {
    return (
      <OfflineNotice />
    );
  }

  return (
    <View style={styles.container} accessible={true} accessibilityLabel="Check Out Screen">
      <View style={styles.card}>
        {/* Lottie animation for home */}
        <View style={{ width: 120, height: 120, marginBottom: 20 }}>
          <LottieView
            source={{
              uri: "https://lottie.host/e0fe36ea-db79-48fc-b40a-8c550970cc09/iKa9zRuPni.lottie",
            }}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
        </View>
        <Text style={styles.title}>Leaving?</Text>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCheckOut}
          disabled={loading}
          accessibilityLabel="Check out"
          accessibilityState={{ disabled: loading }}
        >
          {loading ? (
            <Loader />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Out</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default CheckOutScreen;
