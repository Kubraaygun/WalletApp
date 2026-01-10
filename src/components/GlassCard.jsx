import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { BorderRadius, Spacing } from "../../utils/spacing";

/**
 * GlassCard - Glassmorphism card component with blur and gradient
 * 
 * @param {ReactNode} children - Card content
 * @param {number} intensity - Blur intensity (0-100)
 * @param {Object} style - Additional styles
 * @param {boolean} border - Show gradient border
 */
const GlassCard = ({ 
  children, 
  intensity = 50, 
  style, 
  border = true,
  borderRadius = BorderRadius.xl,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { borderRadius }, style]}>
      {/* Gradient Border */}
      {border && (
        <LinearGradient
          colors={[
            isDark ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
            isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.3)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.borderGradient, { borderRadius }]}
        />
      )}
      
      {/* Blur Background */}
      <BlurView 
        intensity={intensity} 
        tint={isDark ? "dark" : "light"}
        style={[styles.blur, { borderRadius: borderRadius - 1 }]}
      >
        {/* Inner Gradient Overlay */}
        <LinearGradient
          colors={[
            isDark ? "rgba(30,30,40,0.7)" : "rgba(255,255,255,0.7)",
            isDark ? "rgba(20,20,30,0.5)" : "rgba(255,255,255,0.4)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.innerGradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

/**
 * GlassButton - Glassmorphism button
 */
export const GlassButton = ({ 
  children, 
  onPress, 
  style,
  intensity = 40,
}) => {
  const { isDark } = useTheme();

  return (
    <View style={[styles.buttonContainer, style]}>
      <BlurView 
        intensity={intensity} 
        tint={isDark ? "dark" : "light"}
        style={styles.buttonBlur}
      >
        <LinearGradient
          colors={[
            isDark ? "rgba(60,60,80,0.8)" : "rgba(255,255,255,0.9)",
            isDark ? "rgba(40,40,60,0.6)" : "rgba(255,255,255,0.7)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  borderGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 1,
  },
  blur: {
    flex: 1,
    overflow: "hidden",
    margin: 1,
  },
  innerGradient: {
    flex: 1,
  },
  buttonContainer: {
    overflow: "hidden",
    borderRadius: BorderRadius.lg,
  },
  buttonBlur: {
    overflow: "hidden",
    borderRadius: BorderRadius.lg,
  },
  buttonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GlassCard;
