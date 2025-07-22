import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BASE_URL } from "../../config/config";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const OTP: React.FC<Props> = ({ navigation }) => {
  const [otp, setOtp] = useState<string>("");

  const handleOtpSubmit = async () => {
    try {
      if (!otp) {
        throw new Error("Invalid OTP. Please enter a valid OTP.");
      }

      const response = await fetch(BASE_URL + "/validate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
          "otp-code": otp,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (__DEV__) {
          console.error("API Error:", {
            status: response.status,
            statusText: response.statusText,
            responseBody: errorText,
          });
        } else {
          console.error("An error occurred while validating OTP.");
        }
        throw new Error("Failed to validate OTP");
      }

      const data = await response.json();

      // Extract student_id from the response and store in AsyncStorage
      const { success, student_id, message } = data;

      if (!success) {
        throw new Error(message || "Invalid response from server");
      }

      // Store student_id in AsyncStorage
      await AsyncStorage.setItem("student_id", String(student_id));

      // Navigate to CheckIn screen
      navigation.replace("CheckIn");
    } catch (error) {
      if (__DEV__) {
        console.error("Error during OTP validation:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : null,
          otpValue: otp,
        });
      } else {
        console.error("An error occurred during OTP validation.");
      }
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    backgroundColor: "#667eea",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default OTP;
