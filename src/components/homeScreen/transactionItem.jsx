import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import Avatar from "../avatar";
import { useTheme } from "../../contexts/ThemeContext";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const TransactionItem = ({ item, onPress }) => {
  const { colors } = useTheme();

  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (typeof dateStr === "string" && dateStr.includes("/")) {
      return dateStr;
    }
    return dateStr;
  };

  const isSent = true;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.SURFACE }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.ERROR}15` }]}>
          <Icon
            name={isSent ? "arrow-up-right" : "arrow-down-left"}
            size={IconSize.sm}
            color={isSent ? colors.ERROR : colors.SUCCESS}
          />
        </View>
        <View style={styles.details}>
          <Text style={[styles.receiver, { color: colors.TEXT_PRIMARY }]} numberOfLines={1}>
            {item.receiver || "Bilinmeyen"}
          </Text>
          <Text style={[styles.date, { color: colors.TEXT_SECONDARY }]}>{formatDate(item.date)}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: isSent ? colors.ERROR : colors.SUCCESS }]}>
          {isSent ? "-" : "+"}₺{formatAmount(item.amount)}
        </Text>
        <Icon name="chevron-right" size={IconSize.sm} color={colors.GRAY_400} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    ...Shadows.xs,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  receiver: {
    ...TextStyles.bodyMedium,
    fontWeight: "500",
  },
  date: {
    ...TextStyles.caption,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    ...TextStyles.bodyMedium,
    fontWeight: "600",
    marginRight: Spacing.xs,
  },
});

export default TransactionItem;
