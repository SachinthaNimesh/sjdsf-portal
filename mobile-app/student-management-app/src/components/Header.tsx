import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getStudentById } from '../api/studentService';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        // If not found, fetch from API
        const student = await getStudentById();
        let firstName = '';
        if (Array.isArray(student) && student.length > 0) {
          firstName = student[0]?.first_name ?? '';
        } else if (student && typeof student === 'object') {
          firstName = student.first_name ?? '';
        }
        setStudentName(firstName);
        if (firstName) {
          await AsyncStorage.setItem('student_first_name', firstName);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
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