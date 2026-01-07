import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize, moderateScale } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";
import { useTheme } from "../../contexts/ThemeContext";

const ResultInfo = ({
  formattedAmount,
  phoneNumber,
  description,
  formattedDate,
  formattedTime,
}) => {
  const { colors } = useTheme();

  const InfoRow = ({ icon, label, value }) => (
    <View style={[styles.infoRow, { borderBottomColor: colors.BORDER, paddingVertical: moderateScale(Spacing.xxs) }]}>
      <View style={[styles.infoIcon, { backgroundColor: `${colors.ACCENT}15` }]}>
        <Icon name={icon} size={IconSize.sm} color={colors.ACCENT} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.TEXT_SECONDARY }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.TEXT_PRIMARY }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Amount Highlight */}
      <View style={[styles.amountContainer, { backgroundColor: colors.SURFACE, paddingVertical: moderateScale(Spacing.md) }]}>
        <Text style={[styles.amountLabel, { color: colors.TEXT_SECONDARY }]}>Transfer Tutarı</Text>
        <Text style={[styles.amount, { color: colors.ACCENT }]}>₺{formattedAmount}</Text>
      </View>

      {/* Details Card */}
      <View style={[styles.detailsCard, { backgroundColor: colors.CARD }]}>
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
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  amountLabel: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.xxs,
  },
  amount: {
    ...TextStyles.displayMedium,
  },
  detailsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...TextStyles.caption,
  },
  infoValue: {
    ...TextStyles.labelMedium,
    marginTop: 1,
  },
});

export default ResultInfo;
