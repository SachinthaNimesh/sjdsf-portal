import React, { useEffect } from "react";
import { View, Animated, Easing } from "react-native";
import styles from "./Loader.styles";

const Loader = () => {
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => animation.stop();
    }, [rotateAnim]);

    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.spinner,
            { transform: [{ rotate: spin }] }
          ]}
        >
          {/* Arc (partial circle) */}
          <View style={styles.arc} />
          {/* Orange dot at the top */}
          <View style={styles.dot} />
        </Animated.View>
      </View>
    );
};

export default Loader;