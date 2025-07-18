import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { postMood, MoodType } from '../api/moodService';
import NetInfo from '@react-native-community/netinfo';

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
      <View style={[StyleSheet.absoluteFill, styles.container, { backgroundColor: '#667eea', zIndex: 999, justifyContent: 'center', alignItems: 'center', padding: 0 }]}>
        <View/>
        <View style={styles.noInternetCard}>
          <Text style={styles.noInternetEmoji}>🛜</Text>
          <Text style={styles.noInternetTitle}>No Internet Connection</Text>
          <Text style={styles.noInternetMsg}>Turn Mobile Data or Wifi On 🛜</Text>
          <Text style={styles.noInternetWait}>Waiting for connection...</Text>
        </View>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  moodCard: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D2D2D',
    marginBottom: 25,
    alignSelf: 'center',
  },
  moodButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 0,
    marginHorizontal: 0,
    minWidth: 120,
    minHeight: 64,
    shadowColor: '#22543d',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  flexGrow: {
    flex: 1,
  },
  moodEmoji: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    backgroundColor: '#fff',
    shadowColor: '#b7e4c7',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  emojiText: {
    fontSize: 44,
    textAlign: 'center',
    color: '#22543d',
    width: 60,
    height: 60,
    textAlignVertical: 'center',
    lineHeight: 60,
    includeFontPadding: false,
  },
  moodText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#22543d',
    letterSpacing: 0.2,
    opacity: 0.92,
  },
  happy: {
    backgroundColor: '#f0fff4',
    borderColor: '#68d391',
    borderWidth: 0,
  },
  neutral: {
    backgroundColor: '#fffaf0',
    borderColor: '#fbb6ce',
    borderWidth: 0,
  },
  sad: {
    backgroundColor: '#ebf8ff',
    borderColor: '#90cdf4',
    borderWidth: 0,
  },
  noInternetCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  noInternetMsg: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  noInternetWait: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  selectedMood: {
    backgroundColor: 'rgba(232, 230, 255, 1)',
    borderColor: 'rgba(139, 126, 216, 0.6)',
  },
});

export default Feedback;