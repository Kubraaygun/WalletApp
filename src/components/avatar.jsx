import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";

const SIZES = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 72,
};

const Avatar = ({ 
  name = "User", 
  size = "md", 
  showOnline = false, 
  onlineStatus = "offline" 
}) => {
  const dimension = SIZES[size] || SIZES.md;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const onlineColor = onlineStatus === "online" ? Colors.SUCCESS : Colors.GRAY_400;

  return (
    <View style={[styles.container, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}>
      <Text style={[styles.initials, { fontSize: dimension * 0.4 }]}>{initials}</Text>
      {showOnline && (
        <View 
          style={[
            styles.onlineIndicator, 
            { backgroundColor: onlineColor }
          ]} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ACCENT,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  initials: {
    ...TextStyles.labelMedium,
    color: Colors.WHITE,
    fontWeight: "600",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.SURFACE,
  },
});

export default Avatar;
