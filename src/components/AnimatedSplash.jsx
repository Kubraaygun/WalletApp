import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather as Icon } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const AnimatedSplash = ({ onAnimationComplete }) => {
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const circleScale = useSharedValue(0);
  const fadeOut = useSharedValue(1);

  useEffect(() => {
    // Animation sequence
    // 1. Logo scale in with bounce
    logoScale.value = withSpring(1, { 
      damping: 12, 
      stiffness: 100,
      mass: 0.8,
    });

    // 2. Logo subtle rotation
    logoRotate.value = withSequence(
      withDelay(300, withSpring(10, { damping: 8 })),
      withSpring(0, { damping: 8 })
    );

    // 3. Circle pulse
    circleScale.value = withDelay(
      200,
      withSpring(1, { damping: 15, stiffness: 80 })
    );

    // 4. Text fade in
    textOpacity.value = withDelay(400, withSpring(1));
    textTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));

    // 5. Fade out and complete
    const timeout = setTimeout(() => {
      fadeOut.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity: interpolate(circleScale.value, [0, 1], [0, 0.3]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeOut.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={["#667EEA", "#764BA2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Background circles */}
        <Animated.View style={[styles.circle1, circleStyle]} />
        <Animated.View style={[styles.circle2, circleStyle]} />
        
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logoInner}>
            <Icon name="credit-card" size={48} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.appName}>WalletApp</Text>
          <Text style={styles.tagline}>Güvenli • Hızlı • Kolay</Text>
        </Animated.View>

        {/* Version */}
        <Animated.Text style={[styles.version, textStyle]}>
          v1.0.0
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle1: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -width * 0.5,
    left: -width * 0.25,
  },
  circle2: {
    position: "absolute",
    width: width,
    height: width,
    borderRadius: width * 0.5,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -width * 0.3,
    right: -width * 0.2,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 2,
  },
  version: {
    position: "absolute",
    bottom: 50,
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
});

export default AnimatedSplash;
