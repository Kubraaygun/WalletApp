import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { Feather as Icon } from "@expo/vector-icons";

/**
 * AnimatedTabIcon - Tab bar icon with spring scale and color animation
 * 
 * @param {string} name - Feather icon name
 * @param {boolean} focused - Tab focus state
 * @param {number} size - Icon size (default: 22)
 * @param {string} activeColor - Color when focused
 * @param {string} inactiveColor - Color when not focused
 */
const AnimatedTabIcon = ({
  name,
  focused,
  size = 22,
  activeColor,
  inactiveColor,
}) => {
  const scale = useSharedValue(focused ? 1.15 : 1);
  const progress = useSharedValue(focused ? 1 : 0);
  const translateY = useSharedValue(focused ? -2 : 0);

  useEffect(() => {
    if (focused) {
      // Bounce effect on focus
      scale.value = withSpring(1.2, { 
        damping: 8, 
        stiffness: 300,
        mass: 0.5,
      });
      setTimeout(() => {
        scale.value = withSpring(1.1, { damping: 12, stiffness: 200 });
      }, 100);
      
      translateY.value = withSpring(-3, { damping: 12, stiffness: 250 });
      progress.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedIconStyle}>
        <Icon 
          name={name} 
          size={size} 
          color={focused ? activeColor : inactiveColor} 
        />
      </Animated.View>
      <Animated.View 
        style={[
          styles.activeDot, 
          { backgroundColor: activeColor },
          animatedDotStyle,
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },
});

export default AnimatedTabIcon;
