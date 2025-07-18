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

const { width, height } = Dimensions.get('window');

interface ActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
  delay?: number;
  isExpanded: boolean;
  animatedValue: Animated.Value;
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
  delay = 0,
  isExpanded,
  animatedValue,
  actionColor,
  labelColor,
  labelBgColor,
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
      >
        <Icon size={20} color="#FFFFFF" />
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

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAction = (action: string) => {
    console.log(`${action} clicked`);
    setIsExpanded(false);
    if (action === 'Message') {
      // Open chat/message functionality
    } else if (action === 'Call') {
      Linking.openURL('tel:0776117145');
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  backgroundElement1: {
    position: 'absolute',
    top: 80,
    left: 80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E7FF',
    opacity: 0.3,
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: 80,
    right: 80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#F3E8FF',
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  backdropTouchable: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    alignItems: 'flex-end',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  labelContainer: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    position: 'relative',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  labelArrow: {
    position: 'absolute',
    right: -4,
    top: '50%',
    marginTop: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: '#1F2937',
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainFab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  mainFabInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

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