import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import { Spacing, BorderRadius } from "../../utils/spacing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DELETE_THRESHOLD = -80;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

/**
 * SwipeableRow - Swipe to delete row component
 * 
 * @param {ReactNode} children - Row content
 * @param {function} onDelete - Called when delete action triggered
 * @param {function} onSwipeStart - Called when swipe starts
 */
const SwipeableRow = ({ children, onDelete, onSwipeStart }) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const isDeleting = useSharedValue(false);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      if (onSwipeStart) runOnJS(onSwipeStart)();
    },
    onActive: (event, ctx) => {
      const newValue = ctx.startX + event.translationX;
      // Only allow left swipe
      translateX.value = Math.min(0, newValue);
      
      // Trigger haptic when crossing delete threshold
      if (translateX.value < DELETE_THRESHOLD && !isDeleting.value) {
        isDeleting.value = true;
        runOnJS(triggerHaptic)();
      } else if (translateX.value >= DELETE_THRESHOLD) {
        isDeleting.value = false;
      }
    },
    onEnd: (event) => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        // Full swipe - delete
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 });
        runOnJS(handleDelete)();
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
      }
    },
  });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteActionStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, DELETE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      translateX.value,
      [0, DELETE_THRESHOLD, -SWIPE_THRESHOLD],
      [0.5, 1, 1.2],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Delete Action Background */}
      <Animated.View 
        style={[
          styles.deleteAction, 
          { backgroundColor: colors.ERROR },
          deleteActionStyle,
        ]}
      >
        <Icon name="trash-2" size={24} color="#FFFFFF" />
        <Text style={styles.deleteText}>Sil</Text>
      </Animated.View>

      {/* Swipeable Content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.row, rowStyle]}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    marginBottom: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  row: {
    backgroundColor: "transparent",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.md,
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default SwipeableRow;
