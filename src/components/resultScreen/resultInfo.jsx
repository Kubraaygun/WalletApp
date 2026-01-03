import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const ResultInfo = ({
  formattedAmount,
  phoneNumber,
  description,
  formattedDate,
  formattedTime,
}) => {
  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Icon name={icon} size={IconSize.sm} color={Colors.ACCENT} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Amount Highlight */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Transfer Tutarı</Text>
        <Text style={styles.amount}>₺{formattedAmount}</Text>
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <InfoRow icon="user" label="Alıcı" value={phoneNumber} />

        {description && (
          <InfoRow icon="file-text" label="Açıklama" value={description} />
        )}

        <InfoRow
          icon="calendar"
          label="Tarih"
          value={`${formattedDate} - ${formattedTime}`}
        />

        <InfoRow
          icon="hash"
          label="İşlem No"
          value={`TRX${Date.now().toString().slice(-8)}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: Spacing.lg,
  },
  amountContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.GRAY_50,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  amountLabel: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.xxs,
  },
  amount: {
    ...TextStyles.displayMedium,
    color: Colors.ACCENT,
  },
  detailsCard: {
    backgroundColor: Colors.SURFACE,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_100,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.ACCENT}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
  },
  infoValue: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_PRIMARY,
    fontWeight: "500",
    marginTop: 2,
  },
});

export default ResultInfo;
