/**
 * WalletApp - Minimal White Theme (Apple Pay Style)
 * Clean, minimal design with single accent color
 */

// Primary Brand Colors
export const Colors = {
  // Primary Accent - iOS Blue
  PRIMARY: "#007AFF",
  ACCENT: "#007AFF",
  
  // Secondary Colors
  SECONDARY: "#5856D6", // Purple
  TERTIARY: "#FF9500",  // Orange
  
  // Semantic Colors
  SUCCESS: "#34C759",
  WARNING: "#FF9500",
  ERROR: "#FF3B30",
  INFO: "#5AC8FA",
  
  // Neutral - Minimal White Palette
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  
  // Grays - Apple Style
  GRAY_50: "#FAFAFA",
  GRAY_100: "#F5F5F7",
  GRAY_200: "#E5E5EA",
  GRAY_300: "#D1D1D6",
  GRAY_400: "#C7C7CC",
  GRAY_500: "#8E8E93",
  GRAY_600: "#636366",
  GRAY_700: "#48484A",
  GRAY_800: "#3A3A3C",
  GRAY_900: "#1C1C1E",
  
  // Backgrounds
  BACKGROUND: "#FFFFFF",
  SURFACE: "#F5F5F7",
  CARD: "#FFFFFF",
  
  // Text Colors
  TEXT_PRIMARY: "#1C1C1E",
  TEXT_SECONDARY: "#8E8E93",
  TEXT_TERTIARY: "#C7C7CC",
  TEXT_INVERSE: "#FFFFFF",
  
  // Border Colors
  BORDER: "#E5E5EA",
  BORDER_LIGHT: "#F5F5F7",
  
  // Gradients (for cards)
  GRADIENT_START: "#007AFF",
  GRADIENT_END: "#5856D6",
  
  // Overlay
  OVERLAY: "transparent",
  OVERLAY_LIGHT: "rgba(0, 0, 0, 0.05)",
};

// Gradient definitions
export const Gradients = {
  balance: ["#007AFF", "#5856D6"],
  card: ["#1C1C1E", "#3A3A3C"],
  success: ["#34C759", "#30D158"],
  premium: ["#FFD700", "#FF9500"],
};

// Dark Mode Colors
export const DarkColors = {
  // Primary Accent
  PRIMARY: "#0A84FF",
  ACCENT: "#0A84FF",
  
  // Secondary Colors
  SECONDARY: "#5E5CE6",
  TERTIARY: "#FF9F0A",
  
  // Semantic Colors
  SUCCESS: "#30D158",
  WARNING: "#FF9F0A",
  ERROR: "#FF453A",
  INFO: "#64D2FF",
  
  // Neutral
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  
  // Grays - Dark Mode
  GRAY_50: "#1C1C1E",
  GRAY_100: "#2C2C2E",
  GRAY_200: "#3A3A3C",
  GRAY_300: "#48484A",
  GRAY_400: "#636366",
  GRAY_500: "#8E8E93",
  GRAY_600: "#AEAEB2",
  GRAY_700: "#C7C7CC",
  GRAY_800: "#D1D1D6",
  GRAY_900: "#E5E5EA",
  
  // Backgrounds
  BACKGROUND: "#000000",
  SURFACE: "#1C1C1E",
  CARD: "#2C2C2E",
  
  // Text Colors
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#8E8E93",
  TEXT_TERTIARY: "#636366",
  TEXT_INVERSE: "#1C1C1E",
  
  // Border Colors
  BORDER: "#3A3A3C",
  BORDER_LIGHT: "#2C2C2E",
  
  // Gradients
  GRADIENT_START: "#0A84FF",
  GRADIENT_END: "#5E5CE6",
  
  // Overlay
  OVERLAY: "transparent",
  OVERLAY_LIGHT: "rgba(255, 255, 255, 0.05)",
};

export default Colors;
