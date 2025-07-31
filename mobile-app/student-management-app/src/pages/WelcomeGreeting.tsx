import React, { useEffect, useState } from "react";
import { View, Text, BackHandler } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";
import { updateCheckOutTime } from "../api/studentService";
import styles from "./WelcomeGreeting.styles";
import WelcomeAnimation from "../components/WelcomeAnimation"; // <-- import
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const WelcomeGreeting: React.FC<Props> = ({ navigation }) => {
  const [welcomeText, setWelcomeText] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Update check_out_time when WelcomeGreeting loads
    updateCheckOutTime().catch((err) => {
      AsyncStorage.getItem("check_out_time").then((value) => {
        console.log("Check-out time stored:", value);
        if (!value) {
          console.error("Failed to update check_out_time:", err);
        }
      });
    });

    const messages = [
      "Let's do this!",

      "We can do it!",
      "Stay happy!",
      "You are great!",
      "Today will be good!",
      "Keep smiling!",
      "Be your best!",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setWelcomeText(randomMessage);

    const timer1 = setTimeout(() => {
      setShowAnimation(true);
      const timer2 = setTimeout(() => {
        navigation.replace("Emotions");
        setTimeout(() => {
          BackHandler.exitApp();
        }, 0.1);
      }, 1000);
      return () => clearTimeout(timer2);
    }, 3000);

    return () => clearTimeout(timer1);
  }, [navigation]);

  if (showAnimation) {
    return <WelcomeAnimation />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LottieView
          source={{
            uri: "https://lottie.host/8f2c312f-9100-4ff7-be99-99a8bd90a894/TbP8d42cek.lottie",
          }}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.text}>{welcomeText}</Text>
      </View>
    </View>
  );
};

export default WelcomeGreeting;
