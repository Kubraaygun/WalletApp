/**
 * Custom Screen Transition Configurations
 * For use with @react-navigation/stack cardStyleInterpolator
 */

// Spring config for smooth, bouncy transitions
const springConfig = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/**
 * Transition Specs
 */
export const TransitionSpecs = {
  // Spring transition (bouncy)
  spring: {
    open: {
      animation: "spring",
      config: springConfig,
    },
    close: {
      animation: "spring",
      config: springConfig,
    },
  },
  // Timing transition (linear)
  timing: {
    open: {
      animation: "timing",
      config: { duration: 300 },
    },
    close: {
      animation: "timing",
      config: { duration: 250 },
    },
  },
  // Fast timing (for modals)
  fastTiming: {
    open: {
      animation: "timing",
      config: { duration: 250 },
    },
    close: {
      animation: "timing",
      config: { duration: 200 },
    },
  },
};

/**
 * Slide from Right (iOS Default Enhanced)
 */
export const forSlideFromRight = ({ current, next, layouts }) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.width, 0],
  });

  const opacity = current.progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 0.9, 1],
  });

  // Fade out previous screen slightly
  const overlayOpacity = next
    ? next.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.1],
      })
    : 0;

  return {
    cardStyle: {
      transform: [{ translateX }],
      opacity,
    },
    overlayStyle: {
      opacity: overlayOpacity,
    },
  };
};

/**
 * Slide from Bottom (Modal Style)
 */
export const forSlideFromBottom = ({ current, layouts }) => {
  const translateY = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.height, 0],
  });

  const opacity = current.progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 1],
  });

  const borderRadius = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return {
    cardStyle: {
      transform: [{ translateY }],
      opacity,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    },
  };
};

/**
 * Fade In (Crossfade)
 */
export const forFadeIn = ({ current }) => {
  const opacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return {
    cardStyle: {
      opacity,
    },
  };
};

/**
 * Scale from Center (Zoom + Fade)
 */
export const forScaleFromCenter = ({ current }) => {
  const scale = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const opacity = current.progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 1],
  });

  return {
    cardStyle: {
      transform: [{ scale }],
      opacity,
    },
  };
};

/**
 * Slide from Left (for back navigation override)
 */
export const forSlideFromLeft = ({ current, layouts }) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-layouts.screen.width, 0],
  });

  return {
    cardStyle: {
      transform: [{ translateX }],
    },
  };
};

/**
 * Screen Options Presets
 */
export const ScreenTransitions = {
  slideFromRight: {
    cardStyleInterpolator: forSlideFromRight,
    transitionSpec: TransitionSpecs.spring,
    gestureEnabled: true,
    gestureDirection: "horizontal",
  },
  slideFromBottom: {
    cardStyleInterpolator: forSlideFromBottom,
    transitionSpec: TransitionSpecs.fastTiming,
    gestureEnabled: true,
    gestureDirection: "vertical",
  },
  fadeIn: {
    cardStyleInterpolator: forFadeIn,
    transitionSpec: TransitionSpecs.timing,
    gestureEnabled: false,
  },
  scaleFromCenter: {
    cardStyleInterpolator: forScaleFromCenter,
    transitionSpec: TransitionSpecs.spring,
    gestureEnabled: true,
    gestureDirection: "horizontal",
  },
};

export default ScreenTransitions;
