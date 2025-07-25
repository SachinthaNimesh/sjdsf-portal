import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { postMood, MoodType } from '../api/moodService';
import NetInfo from '@react-native-community/netinfo';
import styles from './Feedback.styles';
import OfflineNotice from '../components/OfflineNotice';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
};

const Feedback: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodType | null>(null);
  const [showNoInternet, setShowNoInternet] = useState(false);

  // Add refs for button scale animations
  const buttonScales = {
    happy: useRef(new Animated.Value(1)).current,
    neutral: useRef(new Animated.Value(1)).current,
    sad: useRef(new Animated.Value(1)).current,
  };

  useEffect(() => {
    if (!showNoInternet) return;
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setShowNoInternet(false);
        setActiveMood(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [showNoInternet]);

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
    try {
      await postMood(emotion, 'checkout');
      setTimeout(() => {
        setActiveMood(null);
        navigation.navigate('CheckOutGreeting');
      }, 1000);
    } catch (error: any) {
      if (
        typeof error?.message === 'string' &&
        (
          error.message.toLowerCase().includes('network') ||
          error.message.toLowerCase().includes('internet') ||
          error.message.toLowerCase().includes('connection') ||
          error.message.toLowerCase().includes('failed to fetch')
        )
      ) {
        setShowNoInternet(true);
      } else {
        console.error('Error posting mood:', error);
        alert(error instanceof Error ? error.message : 'An error occurred while saving your mood.');
        setActiveMood(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showNoInternet) {
    return (
      <OfflineNotice />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.moodCard}>
        <Text style={styles.title}>Today?</Text>
        <View style={styles.moodButtons}>
          {(['happy', 'neutral', 'sad'] as const).map((mood) => (
            <Animated.View
              key={mood}
              style={{ transform: [{ scale: buttonScales[mood] }], width: '100%' }}
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
              >
                <View
                  style={[
                    styles.moodEmoji,
                    mood === 'happy'
                      ? styles.happy
                      : mood === 'neutral'
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
                  <ActivityIndicator size="small" color="#8B7ED8" style={{ marginLeft: 10 }} />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Feedback;