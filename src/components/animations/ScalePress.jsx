import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

/**
 * ScalePress - Reusable animated press wrapper
 * 
 * @param {ReactNode} children - Content to wrap
 * @param {Function} onPress - Press callback
 * @param {number} scaleValue - Scale value on press (default: 0.95)
 * @param {boolean} enableHaptics - Enable haptic feedback (default: true)
 * @param {boolean} disabled - Disable interaction (default: false)
 * @param {Object} style - Additional styles
 */
const ScalePress = ({
  children,
  onPress,
  onLongPress,
  scaleValue = 0.95,
  enableHaptics = true,
  disabled = false,
  style,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const triggerHaptic = () => {
    if (enableHaptics && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const handleLongPress = () => {
    if (!disabled && onLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onLongPress();
    }
  };

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(scaleValue, { 
        damping: 15, 
        stiffness: 400,
        mass: 0.5,
      });
      opacity.value = withTiming(0.85, { duration: 80 });
      translateY.value = withSpring(-2, { damping: 15, stiffness: 400 });
      runOnJS(triggerHaptic)();
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { 
        damping: 12, 
        stiffness: 350,
        mass: 0.6,
      });
      opacity.value = withTiming(1, { duration: 150 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 350 });
    })
    .onEnd(() => {
      runOnJS(handlePress)();
    });

  const longPressGesture = Gesture.LongPress()
    .enabled(!disabled && !!onLongPress)
    .minDuration(500)
    .onStart(() => {
      runOnJS(handleLongPress)();
    });

  const composedGesture = Gesture.Simultaneous(tapGesture, longPressGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default ScalePress;
