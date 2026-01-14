import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";
import CustomButton from "../customButton";

const TransferModal = ({
  visible,
  confirmData,
  handleConfirm,
  handleCancel,
}) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              {/* Handle */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Transfer Onayı</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                  <Icon name="x" size={IconSize.md} color={Colors.GRAY_500} />
                </TouchableOpacity>
              </View>

              {/* Amount Display */}
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Gönderilecek Tutar</Text>
                <Text style={styles.amount}>₺{formatAmount(confirmData?.amount || 0)}</Text>
              </View>

              {/* Details */}
              <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Icon name="user" size={IconSize.sm} color={Colors.ACCENT} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Alıcı</Text>
                    <Text style={styles.detailValue}>
                      {confirmData?.phoneNumber || "-"}
                    </Text>
                  </View>
                </View>

                {confirmData?.description && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Icon name="file-text" size={IconSize.sm} color={Colors.ACCENT} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Açıklama</Text>
                      <Text style={styles.detailValue}>
                        {confirmData.description}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Icon name="clock" size={IconSize.sm} color={Colors.ACCENT} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>İşlem Tarihi</Text>
                    <Text style={styles.detailValue}>
                      {new Date().toLocaleDateString("tr-TR")} - Anlık
                    </Text>
                  </View>
                </View>
              </View>

              {/* Warning */}
              <View style={styles.warningContainer}>
                <Icon name="alert-circle" size={IconSize.sm} color={Colors.WARNING} />
                <Text style={styles.warningText}>
                  Bu işlem geri alınamaz. Lütfen bilgileri kontrol edin.
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Onayla"
                  onPress={handleConfirm}
                  variant="primary"
                  size="lg"
                  style={styles.confirmButton}
                />
                <CustomButton
                  title="İptal"
                  onPress={handleCancel}
                  variant="ghost"
                  size="lg"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: Colors.SURFACE,
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["3xl"],
    ...Shadows.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.GRAY_200,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.h2,
    color: Colors.TEXT_PRIMARY,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.GRAY_100,
    justifyContent: "center",
    alignItems: "center",
  },
  amountContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.GRAY_50,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
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
    backgroundColor: Colors.GRAY_50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.ACCENT}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
  },
  detailValue: {
    ...TextStyles.bodyMedium,
    color: Colors.TEXT_PRIMARY,
    fontWeight: "500",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WARNING_LIGHT,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  warningText: {
    ...TextStyles.bodySmall,
    color: Colors.TEXT_PRIMARY,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  buttonContainer: {
    gap: Spacing.xs,
  },
  confirmButton: {
    marginBottom: 0,
  },
});

export default TransferModal;
