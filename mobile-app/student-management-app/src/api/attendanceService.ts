import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/config';

export const postCheckIn = async (latitude: number, longitude: number) => {
  try {
    const student_id = await AsyncStorage.getItem('student_id');
    if (!student_id) {
      throw new Error('Student ID not found');
    }

    const response = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'student-id': student_id.trim(),
        'Content-Type': 'application/json',
        'api-key': String(process.env.EXPO_PUBLIC_API_KEY ?? ''),
      },
      body: JSON.stringify({
        check_in: true,
        check_in_lat: latitude,
        check_in_long: longitude,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to post check-in');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting check-in:', error);
    throw error;
  }
};

export const postCheckOut = async (latitude: number, longitude: number) => {
  try {
    const student_id = await AsyncStorage.getItem('student_id');
    if (!student_id) {
      throw new Error('Student ID not found');
    }

    const response = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'student-id': student_id.trim(),
        'Content-Type': 'application/json',
        'api-key': String(process.env.EXPO_PUBLIC_API_KEY ?? ''),
      },
      body: JSON.stringify({
        check_in: false,
        check_in_lat: latitude, // Use check_in_lat for check-out
        check_in_long: longitude,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to post check-out');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting check-out:', error);
    throw error;
  }
};