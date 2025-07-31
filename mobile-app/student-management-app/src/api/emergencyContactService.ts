import { BASE_URL } from "../../config/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMERGENCY_CONTACT_KEY = 'emergency_contact';

export const getEmergencyContact = async () => {
    try {
        const response = await fetch(`${BASE_URL}/get-emergency-contact`);
        if (!response.ok) {
            throw new Error('Failed to fetch emergency contact');
        }
        const data = await response.json();
        if (data.phone_number && typeof data.phone_number === 'string' && data.phone_number.trim() !== '') {
            await AsyncStorage.setItem(EMERGENCY_CONTACT_KEY, data.phone_number);
            return data.phone_number;
        }
        // If API returns invalid number, fallback to AsyncStorage
        const storedNumber = await AsyncStorage.getItem(EMERGENCY_CONTACT_KEY);
        return storedNumber || '';
    } catch (error) {
        console.error('Error fetching emergency contact:', error);
        // Return fallback number from AsyncStorage if API fails
        const storedNumber = await AsyncStorage.getItem(EMERGENCY_CONTACT_KEY);
        return storedNumber || '';
    }
};