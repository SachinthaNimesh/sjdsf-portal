import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import LottieView from "lottie-react-native";

type Props = {
  navigation: any;
  route: any;
};
const PostEmotion = ({ navigation, route }: Props) => {
  const [thankYouText, setThankYouText] = useState("");

  useEffect(() => {
    const message = "Mood Saved!";
    setThankYouText(message);

    const timer = setTimeout(() => {
      navigation.replace("Emotions");
      setTimeout(() => {
        BackHandler.exitApp();
      }, 1);
    }, 3000); // 3 seconds for production

    return () => clearTimeout(timer);
  }, []);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: "100%",
    padding: 30,
    paddingVertical: 45,
    borderRadius: 18,
  },
  text: {
    color: "#000",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "600",
  },
  lottie: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default PostEmotion;
