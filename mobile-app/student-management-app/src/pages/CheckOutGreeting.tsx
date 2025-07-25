import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import styles from './CheckOutGreeting.styles';
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CheckOutGreeting: React.FC<Props> = ({ navigation }) => {
  const [welcomeText, setWelcomeText] = useState('');

  useEffect(() => {
    const messages = [
      "Great job today!",
      "Enjoy your time off!",
      "Relax and recharge!",
      "See you!",
      "Take care!",
      "Have a wonderful evening!",
      "Thanks for your hard work!",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setWelcomeText(randomMessage);

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
      setTimeout(() => {
        BackHandler.exitApp();
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); 

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LottieView
          source={{ uri: 'https://lottie.host/e65fc1fe-3f05-458a-a191-ed18cf9b9e5d/Wi8X4nh4pZ.lottie' }}
          autoPlay
          loop
          style={{ width: 180, height: 180, alignSelf: 'center', marginBottom: 20 }}
        />
        <Text style={styles.text}>{welcomeText}</Text>
      </View>
    </View>
  );
};


export default CheckOutGreeting;