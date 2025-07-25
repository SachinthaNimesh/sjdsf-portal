import React from "react";
import { View, Text } from "react-native";
import styles from "./OfflineNotice.styles";

type OfflineNoticeProps = {
  message?: string;
  waitMessage?: string;
};

const OfflineNotice: React.FC<OfflineNoticeProps> = ({
  message = "No Internet Connection",
  waitMessage = "Waiting for connection...",
}) => (
  <View style={styles.overlay}>
    <View />
    <View style={styles.card} accessibilityRole="alert" accessibilityLabel={message}>
      <Text style={styles.emoji}>🛜</Text>
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.msg}>Turn Mobile Data or Wifi On 🛜</Text>
      <Text style={styles.wait}>{waitMessage}</Text>
    </View>
  </View>
);

export default OfflineNotice;
  