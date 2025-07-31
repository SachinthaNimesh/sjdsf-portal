import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { postMood, MoodType } from "../api/moodService";
import { postCheckOut } from "../api/attendanceService";
import NetInfo from "@react-native-community/netinfo";
import FloatingActionButton from "../components/FAB";
import { getCurrentLocationOnce } from "../utils/location";
import styles from "./Emotion.styles";
import OfflineNotice from "../components/OfflineNotice";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const moodEmojis = {
  happy: "😊",
  neutral: "😐",
  sad: "😢",
};

const Emotion: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodType | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showNoInternet, setShowNoInternet] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const checkOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add refs for button scale animations
  const buttonScales = {
    happy: useRef(new Animated.Value(1)).current,
    neutral: useRef(new Animated.Value(1)).current,
    sad: useRef(new Animated.Value(1)).current,
  };

  const handleMoodPressIn = (mood: MoodType) => {
    Animated.spring(buttonScales[mood], {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handleMoodPressOut = (mood: MoodType) => {
    Animated.spring(buttonScales[mood], {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handleMoodPress = async (emotion: MoodType) => {
    setActiveMood(emotion);
    setLoading(true);
    setErrorMsg(null);
    try {
      await postMood(emotion, "checkin");
      navigation.replace("PostEmotion");
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
        setErrorMsg(
          error instanceof Error ? error.message : "Error saving mood."
        );
        setActiveMood(null);
      }
    } finally {
      setLoading(false);
      setActiveMood(null);
    }
  };

  useEffect(() => {
    if (!showNoInternet) return;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setShowNoInternet(false);
        setActiveMood(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [showNoInternet]);

  // --- Checkout flow extracted for FAB ---
  const handleEarlyCheckout = useCallback(async () => {
    setErrorMsg(null);
    try {
      setCheckoutLoading(true);
      setLoading(true);

      const { latitude, longitude } = await getCurrentLocationOnce();

      if (latitude === null || longitude === null) {
        setCheckoutLoading(false);
        setLoading(false);
        setErrorMsg("Location data not available. Please try again.");
        return;
      }
      await postCheckOut(latitude, longitude);
      navigation.replace("Feedback");
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
        setErrorMsg(
          error instanceof Error ? error.message : "Error! Please try again."
        );
      }
    } finally {
      setCheckoutLoading(false);
      setLoading(false);
    }
  }, [navigation]);

  // Fetch checkout time and set timer for auto-navigation
  useEffect(() => {
    let isMounted = true;
    async function fetchAndSetTimer() {
      try {
        // Always fetch check_out_time from AsyncStorage
        const checkOutTimeValue = await AsyncStorage.getItem("check_out_time");
        if (!isMounted) return;
        if (checkOutTimeValue) {
          // Only use time (HH:MM:SS) for today
          const [hh, mm, ss] = checkOutTimeValue.split(":").map(Number);
          const now = new Date();
          const nowSeconds =
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
          const checkOutSeconds = hh * 3600 + mm * 60 + ss;
          const thirtyMinBeforeSeconds = checkOutSeconds - 30 * 60;
          const secondsUntil = thirtyMinBeforeSeconds - nowSeconds;

          if (secondsUntil <= 0) {
            // Already within 30 minutes, navigate immediately
            navigation.replace("CheckOut");
          } else {
            // Set timer to navigate at the right time
            if (checkOutTimerRef.current)
              clearTimeout(checkOutTimerRef.current);
            checkOutTimerRef.current = setTimeout(() => {
              navigation.replace("CheckOut");
            }, secondsUntil * 1000);
          }
        }
      } catch (e) {
        // Silent fail
      }
    }
    fetchAndSetTimer();
    return () => {
      isMounted = false;
      if (checkOutTimerRef.current) clearTimeout(checkOutTimerRef.current);
    };
  }, [navigation]);

  if (showNoInternet) {
    return <OfflineNotice />;
  }

  return (
    <View style={styles.container}>
      {errorMsg && (
        <View style={styles.errorMsgContainer}>
          <Text style={styles.errorMsgText}>{errorMsg}</Text>
        </View>
      )}
      <View style={styles.headerSpacer} />
      <View style={styles.contentWrapper}>
        <View style={styles.moodCard}>
          <Text style={styles.title}>How are you?</Text>
          <View style={styles.moodButtons}>
            {(["happy", "neutral", "sad"] as const).map((mood) => (
              <Animated.View
                key={mood}
                style={{
                  transform: [{ scale: buttonScales[mood] }],
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.moodButton,
                    activeMood === mood && loading ? styles.selectedMood : null,
                  ]}
                  onPressIn={() => handleMoodPressIn(mood)}
                  onPressOut={() => handleMoodPressOut(mood)}
                  onPress={() => handleMoodPress(mood)}
                  disabled={loading || activeMood !== null}
                  activeOpacity={0.8}
                  accessibilityLabel={`Select mood: ${mood}`}
                  accessibilityRole="button"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      minWidth: 120,
                      minHeight: 64,
                    }}
                  >
                    <View
                      style={[
                        styles.moodEmoji,
                        mood === "happy"
                          ? styles.happy
                          : mood === "neutral"
                          ? styles.neutral
                          : styles.sad,
                      ]}
                    >
                      <Text style={styles.emojiText}>{moodEmojis[mood]}</Text>
                    </View>
                    <Text style={styles.moodText}>
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </Text>
                    <View style={styles.flexGrow} />
                    {activeMood === mood && loading && (
                      <ActivityIndicator
                        size="small"
                        color="#8B7ED8"
                        style={{ marginLeft: 10 }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
        {/* FAB with checkout option */}
        <View style={styles.fabContainerStyle}>
          <FloatingActionButton
            mainColor="#8B7ED8"
            actionColor="#FFD93D"
            labelColor="#4A4A6A"
            labelBgColor="#FFFBEA"
            backdropColor="#667eea"
            checkoutLoading={checkoutLoading}
            onCheckout={handleEarlyCheckout}
            navigation={navigation}
          />
        
        </View>
      </View>
    </View>
  );
};

export default Emotion;
