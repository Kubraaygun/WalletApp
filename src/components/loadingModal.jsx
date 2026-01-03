import React from "react";
import { View, Text, Modal, ActivityIndicator, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius } from "../utils/spacing";

const LoadingModal = ({ message = "Lütfen bekleyin..." }) => {
  const loading = useSelector((state) => state.loading);

  return (
    <Modal visible={loading} transparent statusBarTranslucent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.ACCENT} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.OVERLAY,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.SURFACE,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    minWidth: 160,
  },
  message: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_PRIMARY,
    marginTop: Spacing.md,
    textAlign: "center",
  },
});

export default LoadingModal;
