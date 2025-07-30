import React, { useEffect } from 'react';
import { 
  View, 
  Dimensions 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeAnimation from '../components/WelcomeAnimation';
import styles from './Welcome.styles';

const { height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const Welcome: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkStudentId = async () => {
      try {
        const studentId = await AsyncStorage.getItem('student_id');
        // Wait for 4 seconds before navigating
        await new Promise(resolve => setTimeout(resolve, 4000));
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
      <WelcomeAnimation />
    </View>
  );
};

export default Welcome;