import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import styles from './Fab.styles';
import { getEmergencyContact } from '../api/emergencyContactService';

interface ActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
  delay?: number;
  isExpanded: boolean;
  animatedValue: Animated.Value;
  loading?: boolean;
}

interface FloatingActionButtonProps {
  mainColor?: string;
  actionColor?: string;
  labelColor?: string;
  labelBgColor?: string;
  backdropColor?: string;
  checkoutLoading?: boolean;
  onCheckout?: () => void;
}

const ActionButton: React.FC<ActionButtonProps & {
  actionColor: string;
  labelColor: string;
  labelBgColor: string;
}> = ({
  icon: Icon,
  label,
  onPress,

  animatedValue,
  actionColor,
  labelColor,
  labelBgColor,
  loading = false,
}) => {
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const labelTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const labelOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.actionContainer,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.labelContainer,
          {
            opacity: labelOpacity,
            transform: [{ translateX: labelTranslateX }],
            backgroundColor: labelBgColor,
          },
        ]}
      >
        <Text style={[styles.labelText, { color: labelColor }]}>{label}</Text>
        <View style={[styles.labelArrow, { borderLeftColor: labelBgColor }]} />
      </Animated.View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: actionColor }]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#8B7ED8" />
        ) : (
          <Icon size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const FloatingActionButton: React.FC<FloatingActionButtonProps & { navigation?: any }> = ({
  mainColor = '#8B7ED8',
  actionColor = '#3B82F6',
  labelColor = '#FFFFFF',
  labelBgColor = '#1F2937',
  backdropColor = '#000000',
  checkoutLoading = false,
  onCheckout,
  navigation,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [emergencyContact, setEmergencyContact] = useState<string>('');

  useEffect(() => {
    const toValue = isExpanded ? 1 : 0;
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotationValue, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isExpanded ? 0.3 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded]);

  useEffect(() => {
    // Fetch emergency contact each time FAB loads
    const fetchContact = async () => {
      const contact = await getEmergencyContact();
      setEmergencyContact(contact);
    };
    fetchContact();
  }, []);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAction = (action: string) => {
    console.log(`${action} clicked`);
    setIsExpanded(false);
    if (action === 'Message') {
      // Open chat/message functionality
    } else if (action === 'Call') {
      if (emergencyContact && emergencyContact.trim() !== '') {
        Linking.openURL(`tel:${emergencyContact}`);
      }
    }
  };

  const handleUndoCheckIn = () => {
    if (navigation && typeof navigation.replace === 'function') {
      navigation.replace('CheckIn');
    }
    setIsExpanded(false);
  };

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
            backgroundColor: backdropColor,
            pointerEvents: isExpanded ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={handleToggle}
          activeOpacity={1}
        />
      </Animated.View>

      {/* FAB Container */}
      <View style={styles.fabContainer}>
        <ActionButton
          icon={({ size = 20, color = "#FFF" }) => (
            <Text style={{ fontSize: size, color }}>↩️</Text>
          )}
          label="Undo Checkin"
          onPress={handleUndoCheckIn}
          delay={100}
          isExpanded={isExpanded}
          animatedValue={animatedValue}
          actionColor={actionColor}
          labelColor={labelColor}
          labelBgColor={labelBgColor}
        />

        <ActionButton
          icon={Phone}
          label="Make Call"
          onPress={() => handleAction('Call')}
          delay={0}
          isExpanded={isExpanded}
          animatedValue={animatedValue}
          actionColor={actionColor}
          labelColor={labelColor}
          labelBgColor={labelBgColor}
        />

        <ActionButton
          icon={HomeIcon}
          label="Early Checkout"
          onPress={onCheckout ? onCheckout : () => {}}
          delay={200}
          isExpanded={isExpanded}
          animatedValue={animatedValue}
          actionColor={actionColor}
          labelColor={labelColor}
          labelBgColor={labelBgColor}
          loading={checkoutLoading}
        />

        {/* Main FAB */}
        <TouchableOpacity
          style={[styles.mainFab, { backgroundColor: mainColor }]}
          onPress={handleToggle}
          activeOpacity={0.8}
          
        >
          <Animated.View
            style={[
              styles.mainFabInner,
              {
                transform: [{ rotate: rotation }],
              },
            ]}
          >
            {isExpanded ? (
              <X size={24} color="#FFFFFF" />
            ) : (
              <Plus size={24} color="#FFFFFF" />
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};


// Add fallback icon components using emoji (replace icon props in ActionButton usage if needed)
const Plus = ({ size = 24, color = "#FFF" }) => (
  <Text style={{ fontSize: size, color }}>☰</Text>
);
const X = ({ size = 24, color = "#FFF" }) => (
  <Text style={{ fontSize: size, color }}>✕</Text>
);
const MessageCircle = ({ size = 20, color = "#FFF" }) => (
  <Text style={{ fontSize: size, color }}>💬</Text>
);
const Phone = ({ size = 20, color = "#FFF" }) => (
  <Text style={{ fontSize: size, color }}>📞</Text>
);
const HomeIcon = ({ size = 20, color = "#FFF" }) => (
  <Text style={{ fontSize: size, color }}>🏠</Text>
);

export default FloatingActionButton;