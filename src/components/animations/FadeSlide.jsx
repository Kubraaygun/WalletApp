import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

/**
 * Fade + Slide animasyonu ile görünüm bileşeni
 */
const FadeSlide = ({
  children,
  delay = 0,
  duration = 400,
  direction = "up", // up, down, left, right
  distance = 20,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration]);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return [{ translateY: translate }];
      case "down":
        return [{ translateY: Animated.multiply(translate, -1) }];
      case "left":
        return [{ translateX: translate }];
      case "right":
        return [{ translateX: Animated.multiply(translate, -1) }];
      default:
        return [{ translateY: translate }];
    }
  };

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: getTransform(),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FadeSlide;
