import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  SlideInUp,
} from "react-native-reanimated";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import TransactionItem from "./transactionItem";
import { useTheme } from "../../contexts/ThemeContext";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const TransactionList = ({ transactions, onSeeAll, maxItems = 5 }) => {
  const { colors } = useTheme();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const displayedTransactions = transactions.slice(0, maxItems);
  const hasMore = transactions.length > maxItems;

  const handleTransactionPress = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTransaction(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const getTransactionStatus = (transaction) => {
    // Mock status based on amount for demo
    const amount = parseFloat(transaction.amount);
    if (amount > 1000) return { label: "Tamamlandı", color: "#4ADE80", icon: "check-circle" };
    if (amount > 500) return { label: "İşlemde", color: "#FBBF24", icon: "clock" };
    return { label: "Tamamlandı", color: "#4ADE80", icon: "check-circle" };
  };

  if (!transactions.length) {
    return (
      <View style={styles.emptyContainer}>
        <View style={[styles.emptyIconContainer, { backgroundColor: colors.SURFACE }]}>
          <Icon name="inbox" size={IconSize["2xl"]} color={colors.GRAY_400} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.TEXT_PRIMARY }]}>Henuz islem yok</Text>
        <Text style={[styles.emptySubtitle, { color: colors.TEXT_SECONDARY }]}>
          Ilk para transferinizi yaparak baslayin
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Son Islemler</Text>
        {hasMore && (
          <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
            <Text style={[styles.seeAllText, { color: colors.ACCENT }]}>Tumunu Gor</Text>
            <Icon name="chevron-right" size={IconSize.sm} color={colors.ACCENT} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayedTransactions}
        renderItem={({ item, index }) => (
          <TransactionItem 
            item={item} 
            index={index}
            onPress={() => handleTransactionPress(item)}
          />
        )}
        keyExtractor={(item, index) => item.id || index.toString()}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Transaction Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: colors.OVERLAY }]}
          activeOpacity={1}
          onPress={closeModal}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => {}}
            style={[styles.modalContent, { backgroundColor: colors.SURFACE }]}
          >
            {/* Modal Handle */}
            <View style={styles.modalHandle}>
              <View style={[styles.handleBar, { backgroundColor: colors.GRAY_300 }]} />
            </View>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>İşlem Detayı</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="x" size={IconSize.md} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <View style={styles.modalBody}>
                {/* Status Badge */}
                {(() => {
                  const status = getTransactionStatus(selectedTransaction);
                  return (
                    <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
                      <Icon name={status.icon} size={14} color={status.color} />
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  );
                })()}

                {/* Amount */}
                <View style={[styles.amountContainer, { backgroundColor: colors.BACKGROUND }]}>
                  <Text style={[styles.amountLabel, { color: colors.TEXT_SECONDARY }]}>Tutar</Text>
                  <Text style={[styles.amountValue, { color: colors.ERROR }]}>
                    -₺{formatAmount(selectedTransaction.amount)}
                  </Text>
                </View>

                {/* Details */}
                <DetailRow 
                  icon="user" 
                  label="Alıcı" 
                  value={selectedTransaction.receiver}
                  colors={colors}
                />

                {selectedTransaction.description && (
                  <DetailRow 
                    icon="file-text" 
                    label="Açıklama" 
                    value={selectedTransaction.description}
                    colors={colors}
                  />
                )}

                <DetailRow 
                  icon="calendar" 
                  label="Tarih" 
                  value={selectedTransaction.date}
                  colors={colors}
                />

                <DetailRow 
                  icon="hash" 
                  label="İşlem No" 
                  value={selectedTransaction.id}
                  colors={colors}
                  isLast
                />

                {/* Transaction Type */}
                <DetailRow 
                  icon="arrow-up-right" 
                  label="İşlem Tipi" 
                  value="Para Transferi"
                  colors={colors}
                  isLast
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.secondaryBtn, { borderColor: colors.BORDER }]} 
                onPress={closeModal}
              >
                <Icon name="share-2" size={18} color={colors.TEXT_PRIMARY} />
                <Text style={[styles.secondaryBtnText, { color: colors.TEXT_PRIMARY }]}>Paylaş</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.primaryBtn, { backgroundColor: colors.ACCENT }]} 
                onPress={closeModal}
              >
                <Text style={styles.primaryBtnText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Detail Row Component
const DetailRow = ({ icon, label, value, colors, isLast = false }) => (
  <View style={[
    styles.detailRow, 
    !isLast && { borderBottomColor: colors.BORDER, borderBottomWidth: 1 }
  ]}>
    <View style={[styles.detailIcon, { backgroundColor: `${colors.ACCENT}15` }]}>
      <Icon name={icon} size={IconSize.sm} color={colors.ACCENT} />
    </View>
    <View style={styles.detailContent}>
      <Text style={[styles.detailLabel, { color: colors.TEXT_SECONDARY }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...TextStyles.h4,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    ...TextStyles.labelMedium,
    marginRight: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
    marginHorizontal: Spacing.md,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...TextStyles.h4,
    marginBottom: Spacing.xxs,
  },
  emptySubtitle: {
    ...TextStyles.bodySmall,
    textAlign: "center",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    paddingBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
    ...Shadows.lg,
  },
  modalHandle: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: {
    ...TextStyles.h3,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  statusText: {
    ...TextStyles.labelSmall,
    marginLeft: Spacing.xxs,
    fontWeight: "600",
  },
  modalBody: {
    marginBottom: Spacing.lg,
  },
  amountContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  amountLabel: {
    ...TextStyles.caption,
    marginBottom: Spacing.xxs,
  },
  amountValue: {
    ...TextStyles.displayMedium,
    fontWeight: "700",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...TextStyles.caption,
  },
  detailValue: {
    ...TextStyles.bodyMedium,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  secondaryBtnText: {
    ...TextStyles.labelMedium,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  primaryBtnText: {
    ...TextStyles.labelLarge,
    color: "#FFFFFF",
  },
});

export default TransactionList;
