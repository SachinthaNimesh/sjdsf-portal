import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';


export type MoodType = 'happy' | 'neutral' | 'sad';

export const postMood = async (mood: MoodType, type: 'checkin' | 'checkout') => {
  try {
    const student_id = await AsyncStorage.getItem('student_id');
    if (!student_id) {
      throw new Error('Student ID not found');
    }

    const response = await fetch(`${BASE_URL}/post-mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'student-id': student_id.trim(),
        'api-key': String(process.env.EXPO_PUBLIC_API_KEY ?? ''),
      },
      body: JSON.stringify({
        emotion: mood,
        is_daily: type === 'checkin' ? false : true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to post mood');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting mood:', error);
    throw error;
  }
};