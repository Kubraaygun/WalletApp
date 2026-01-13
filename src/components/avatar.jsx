import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";

const SIZES = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 72,
  "2xl": 100,
};

const Avatar = ({ 
  name = "User", 
  size = "md", 
  image = null,
  showOnline = false, 
  onlineStatus = "offline" 
}) => {
  const { colors } = useTheme();
  const dimension = SIZES[size] || SIZES.md;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fontSize = dimension * 0.38;
  const onlineDotSize = Math.max(dimension * 0.22, 10);

  return (
    <View style={[styles.wrapper, { width: dimension, height: dimension }]}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            }
          ]}
        />
      ) : (
        <LinearGradient
          colors={["#667EEA", "#764BA2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.container, 
            { 
              width: dimension, 
              height: dimension, 
              borderRadius: dimension / 2,
            }
          ]}
        >
          <Text 
            style={[
              styles.initials, 
              { 
                fontSize,
                lineHeight: fontSize * 1.2,
              }
            ]}
          >
            {initials}
          </Text>
        </LinearGradient>
      )}
      
      {showOnline && (
        <View 
          style={[
            styles.onlineIndicator, 
            { 
              backgroundColor: onlineStatus === "online" ? "#4ADE80" : colors.GRAY_400,
              width: onlineDotSize,
              height: onlineDotSize,
              borderRadius: onlineDotSize / 2,
              borderColor: colors.SURFACE,
            }
          ]} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});

export default Avatar;
