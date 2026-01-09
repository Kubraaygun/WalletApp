import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
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
    setSelectedTransaction(item);
    setModalVisible(true);
  };

  const closeModal = () => {
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
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.OVERLAY }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.SURFACE }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>Islem Detayi</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="x" size={IconSize.md} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <View style={styles.modalBody}>
                {/* Amount */}
                <View style={[styles.amountContainer, { backgroundColor: colors.BACKGROUND }]}>
                  <Text style={[styles.amountLabel, { color: colors.TEXT_SECONDARY }]}>Tutar</Text>
                  <Text style={[styles.amountValue, { color: colors.ERROR }]}>
                    -₺{formatAmount(selectedTransaction.amount)}
                  </Text>
                </View>

                {/* Details */}
                <View style={[styles.detailRow, { borderBottomColor: colors.BORDER }]}>
                  <View style={[styles.detailIcon, { backgroundColor: `${colors.ACCENT}15` }]}>
                    <Icon name="user" size={IconSize.sm} color={colors.ACCENT} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: colors.TEXT_SECONDARY }]}>Alici</Text>
                    <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>{selectedTransaction.receiver}</Text>
                  </View>
                </View>

                {selectedTransaction.description && (
                  <View style={[styles.detailRow, { borderBottomColor: colors.BORDER }]}>
                    <View style={[styles.detailIcon, { backgroundColor: `${colors.ACCENT}15` }]}>
                      <Icon name="file-text" size={IconSize.sm} color={colors.ACCENT} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={[styles.detailLabel, { color: colors.TEXT_SECONDARY }]}>Aciklama</Text>
                      <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>{selectedTransaction.description}</Text>
                    </View>
                  </View>
                )}

                <View style={[styles.detailRow, { borderBottomColor: colors.BORDER }]}>
                  <View style={[styles.detailIcon, { backgroundColor: `${colors.ACCENT}15` }]}>
                    <Icon name="calendar" size={IconSize.sm} color={colors.ACCENT} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: colors.TEXT_SECONDARY }]}>Tarih</Text>
                    <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>{selectedTransaction.date}</Text>
                  </View>
                </View>

                <View style={[styles.detailRow, { borderBottomColor: colors.BORDER }]}>
                  <View style={[styles.detailIcon, { backgroundColor: `${colors.ACCENT}15` }]}>
                    <Icon name="hash" size={IconSize.sm} color={colors.ACCENT} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: colors.TEXT_SECONDARY }]}>Islem No</Text>
                    <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>{selectedTransaction.id}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Close Button */}
            <TouchableOpacity style={[styles.modalCloseBtn, { backgroundColor: colors.ACCENT }]} onPress={closeModal}>
              <Text style={styles.modalCloseBtnText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...TextStyles.h3,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  modalBody: {
    marginBottom: Spacing.lg,
  },
  amountContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  amountLabel: {
    ...TextStyles.caption,
    marginBottom: Spacing.xxs,
  },
  amountValue: {
    ...TextStyles.displayMedium,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
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
  modalCloseBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  modalCloseBtnText: {
    ...TextStyles.labelLarge,
    color: "#FFFFFF",
  },
});

export default TransactionList;
