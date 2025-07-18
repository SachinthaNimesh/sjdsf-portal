import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getStudentById } from '../api/studentService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    top: 30, // changed from 30 to 0
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greetingText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  wave: {
    fontSize: 28,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Header;