import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { BorderRadius } from "../../utils/spacing";

/**
 * Skeleton - Shimmer loading placeholder
 * 
 * @param {number} width - Width of skeleton
 * @param {number} height - Height of skeleton  
 * @param {number} borderRadius - Border radius (default: 8)
 * @param {Object} style - Additional styles
 */
const Skeleton = ({ 
  width = "100%", 
  height = 20, 
  borderRadius = BorderRadius.sm,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1, // infinite
      false // no reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-200, 200]
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  const baseColor = isDark ? colors.GRAY_700 : colors.GRAY_200;
  const highlightColor = isDark ? colors.GRAY_600 : colors.GRAY_100;

  return (
    <View 
      style={[
        styles.container, 
        { 
          width, 
          height, 
          borderRadius,
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

/**
 * SkeletonCircle - Circular skeleton for avatars
 */
export const SkeletonCircle = ({ size = 48, style }) => (
  <Skeleton 
    width={size} 
    height={size} 
    borderRadius={size / 2} 
    style={style}
  />
);

/**
 * SkeletonText - Text line skeleton
 */
export const SkeletonText = ({ 
  width = "80%", 
  height = 14, 
  style,
}) => (
  <Skeleton 
    width={width} 
    height={height} 
    borderRadius={height / 2}
    style={style}
  />
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 200,
  },
  gradient: {
    flex: 1,
    width: 200,
  },
});

export default Skeleton;
