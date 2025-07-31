import React, { useEffect, useState } from "react";
import { View, Text, BackHandler } from "react-native";
import LottieView from "lottie-react-native";
import styles from "./PostEmotion.styles";
import WelcomeAnimation from "../components/WelcomeAnimation"; // <-- import

type Props = {
  navigation: any;
  route: any;
};
const PostEmotion = ({ navigation, route }: Props) => {
  const [thankYouText, setThankYouText] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const message = "Mood Saved!";
    setThankYouText(message);

    const timer1 = setTimeout(() => {
      setShowAnimation(true);
      const timer2 = setTimeout(() => {
        navigation.replace("Emotions");
        setTimeout(() => {
          BackHandler.exitApp();
        }, 1);
      }, 1000); // 1 second for WelcomeAnimation
      return () => clearTimeout(timer2);
    }, 3000); // 3 seconds for production

    return () => clearTimeout(timer1);
  }, []);

  if (showAnimation) {
    return <WelcomeAnimation />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LottieView
          source={{
            uri: "https://lottie.host/6a96affd-247c-4922-922c-4e450dc2c827/3TuZ2Aw8fQ.lottie",
          }}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.text}>{thankYouText}</Text>
      </View>
    </View>
  );
};

export default PostEmotion;
