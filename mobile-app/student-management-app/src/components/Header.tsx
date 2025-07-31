import React from 'react';
import { View, Text } from 'react-native';
import { getStudentFirstName } from '../api/studentService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import styles from './Header.styles';

const Header: React.FC = () => {
  const [studentName, setStudentName] = React.useState<string>('');

  React.useEffect(() => {
    const fetchStudentName = async () => {
      try {
        // Try to get from AsyncStorage first
        const cachedName = await AsyncStorage.getItem('student_first_name');
        if (cachedName) {
          setStudentName(cachedName);
          return;
        }
        // Not in AsyncStorage, check network
        const netState = await NetInfo.fetch();
        if (netState.isConnected) {
          // Fetch from API
          const firstName = await getStudentFirstName();
          setStudentName(firstName);
          if (firstName) {
            await AsyncStorage.setItem('student_first_name', firstName);
          }
        } else {
          // Offline and not in AsyncStorage
          setStudentName('');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudentName('');
      }
    };

    fetchStudentName();
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Hi {studentName || '!'}
        </Text>
        <Text style={styles.wave}>👋</Text>
      </View>
      <View style={styles.profilePic}>
        <Text style={styles.profileInitial}>
          {studentName ? studentName.charAt(0).toUpperCase() : ''}
        </Text>
      </View>
    </View>
  );
};

export default Header;