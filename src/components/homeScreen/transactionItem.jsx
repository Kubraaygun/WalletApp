import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Avatar from "../avatar";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const TransactionItem = ({ item, onPress }) => {
  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    // If already formatted, return as is
    if (typeof dateStr === "string" && dateStr.includes("/")) {
      return dateStr;
    }
    return dateStr;
  };

  const isSent = true; // All transactions are outgoing in this app

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, isSent ? styles.sentIcon : styles.receivedIcon]}>
          <Icon
            name={isSent ? "arrow-up-right" : "arrow-down-left"}
            size={IconSize.sm}
            color={isSent ? Colors.ERROR : Colors.SUCCESS}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.receiver} numberOfLines={1}>
            {item.receiver || "Bilinmeyen"}
          </Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, isSent ? styles.sentAmount : styles.receivedAmount]}>
          {isSent ? "-" : "+"}₺{formatAmount(item.amount)}
        </Text>
        <Icon name="chevron-right" size={IconSize.sm} color={Colors.GRAY_300} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.SURFACE,
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
  sentIcon: {
    backgroundColor: Colors.ERROR_LIGHT,
  },
  receivedIcon: {
    backgroundColor: Colors.SUCCESS_LIGHT,
  },
  details: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  receiver: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_PRIMARY,
    fontWeight: "500",
  },
  date: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
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
  sentAmount: {
    color: Colors.ERROR,
  },
  receivedAmount: {
    color: Colors.SUCCESS,
  },
});

export default TransactionItem;
