import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import TransactionItem from "./transactionItem";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const TransactionList = ({ transactions, onSeeAll, maxItems = 5 }) => {
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
        <View style={styles.emptyIconContainer}>
          <Icon name="inbox" size={IconSize["2xl"]} color={Colors.GRAY_300} />
        </View>
        <Text style={styles.emptyTitle}>Henüz işlem yok</Text>
        <Text style={styles.emptySubtitle}>
          İlk para transferinizi yaparak başlayın
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Son İşlemler</Text>
        {hasMore && (
          <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
            <Icon name="chevron-right" size={IconSize.sm} color={Colors.ACCENT} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayedTransactions}
        renderItem={({ item }) => (
          <TransactionItem 
            item={item} 
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İşlem Detayı</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="x" size={IconSize.md} color={Colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <View style={styles.modalBody}>
                {/* Amount */}
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Tutar</Text>
                  <Text style={styles.amountValue}>
                    -₺{formatAmount(selectedTransaction.amount)}
                  </Text>
                </View>

                {/* Details */}
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Icon name="user" size={IconSize.sm} color={Colors.ACCENT} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Alıcı</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.receiver}</Text>
                  </View>
                </View>

                {selectedTransaction.description && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Icon name="file-text" size={IconSize.sm} color={Colors.ACCENT} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Açıklama</Text>
                      <Text style={styles.detailValue}>{selectedTransaction.description}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Icon name="calendar" size={IconSize.sm} color={Colors.ACCENT} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Tarih</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.date}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Icon name="hash" size={IconSize.sm} color={Colors.ACCENT} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>İşlem No</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.id}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Close Button */}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
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
    color: Colors.TEXT_PRIMARY,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    ...TextStyles.labelMedium,
    color: Colors.ACCENT,
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
    backgroundColor: Colors.GRAY_100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...TextStyles.h4,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.xxs,
  },
  emptySubtitle: {
    ...TextStyles.bodySmall,
    color: Colors.TEXT_SECONDARY,
    textAlign: "center",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.SURFACE,
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
    color: Colors.TEXT_PRIMARY,
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
    backgroundColor: Colors.GRAY_50,
    borderRadius: BorderRadius.lg,
  },
  amountLabel: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.xxs,
  },
  amountValue: {
    ...TextStyles.displayMedium,
    color: Colors.ERROR,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_100,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  modalCloseBtn: {
    backgroundColor: Colors.ACCENT,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  modalCloseBtnText: {
    ...TextStyles.labelLarge,
    color: Colors.WHITE,
  },
});

export default TransactionList;
