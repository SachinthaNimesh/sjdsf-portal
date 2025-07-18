import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const Welcome: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkStudentId = async () => {
      try {
        const studentId = await AsyncStorage.getItem('student_id');
        // Wait for 3 seconds before navigating
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        if (studentId) {
          navigation.replace('CheckIn');
        } else {
          navigation.replace('OTP');
        }
      } catch (error) {
        console.error('Error checking student ID:', error);
        navigation.replace('OTP');
      }
    };

    checkStudentId();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worky</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  title: {
    fontSize: 90,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
  },
});

export default Welcome;