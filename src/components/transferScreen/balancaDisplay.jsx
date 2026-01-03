import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const BalanceDisplay = ({ balance }) => {
  const formatBalance = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="credit-card" size={IconSize.sm} color={Colors.ACCENT} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Kullanılabilir Bakiye</Text>
        <Text style={styles.balance}>₺{formatBalance(balance)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.SURFACE,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.ACCENT}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  label: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 2,
  },
  balance: {
    ...TextStyles.h3,
    color: Colors.TEXT_PRIMARY,
  },
});

export default BalanceDisplay;
