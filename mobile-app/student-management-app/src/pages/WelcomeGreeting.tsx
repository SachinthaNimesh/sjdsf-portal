import React, { useEffect, useState } from "react";
import { View, Text, BackHandler } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";
import styles from "./WelcomeGreeting.styles";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const WelcomeGreeting: React.FC<Props> = ({ navigation }) => {
  const [welcomeText, setWelcomeText] = useState("");

  useEffect(() => {
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

    const timer = setTimeout(() => {
      navigation.replace("Emotions");
      setTimeout(() => {
        BackHandler.exitApp();
      }, 0.1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

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
