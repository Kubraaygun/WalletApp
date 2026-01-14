import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView, RefreshControl } from "react-native";
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

// Filter options
const FILTER_TYPES = [
  { id: "all", label: "Tümü", icon: "list" },
  { id: "incoming", label: "Gelen", icon: "arrow-down-left" },
  { id: "outgoing", label: "Giden", icon: "arrow-up-right" },
];

const DATE_FILTERS = [
  { id: "all", label: "Tüm Zamanlar" },
  { id: "today", label: "Bugün" },
  { id: "week", label: "Bu Hafta" },
  { id: "month", label: "Bu Ay" },
];

const AMOUNT_FILTERS = [
  { id: "all", label: "Tüm Tutarlar" },
  { id: "under100", label: "₺100 altı" },
  { id: "100to500", label: "₺100 - ₺500" },
  { id: "500to1000", label: "₺500 - ₺1000" },
  { id: "over1000", label: "₺1000 üzeri" },
];

const TransactionList = ({ 
  transactions, 
  onSeeAll, 
  maxItems = 10, 
  scrollEnabled = false,
  refreshing = false,
  onRefresh = null,
  containerStyle = {}
}) => {
  const { colors } = useTheme();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");

  // Check if any filter is active
  const hasActiveFilters = typeFilter !== "all" || dateFilter !== "all" || amountFilter !== "all";

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Type filter
    if (typeFilter === "incoming") {
      result = result.filter(t => parseFloat(t.amount) > 0);
    } else if (typeFilter === "outgoing") {
      result = result.filter(t => parseFloat(t.amount) < 0);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "today") {
      result = result.filter(t => {
        const txDate = new Date(t.date || now);
        return txDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(t => {
        const txDate = new Date(t.date || now);
        return txDate >= weekAgo;
      });
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(t => {
        const txDate = new Date(t.date || now);
        return txDate >= monthAgo;
      });
    }

    // Amount filter
    if (amountFilter !== "all") {
      result = result.filter(t => {
        const amount = Math.abs(parseFloat(t.amount));
        switch (amountFilter) {
          case "under100": return amount < 100;
          case "100to500": return amount >= 100 && amount < 500;
          case "500to1000": return amount >= 500 && amount < 1000;
          case "over1000": return amount >= 1000;
          default: return true;
        }
      });
    }

    return result;
  }, [transactions, typeFilter, dateFilter, amountFilter]);

  const displayedTransactions = filteredTransactions.slice(0, maxItems);
  const hasMore = filteredTransactions.length > maxItems;

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

  const openFilterModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTypeFilter("all");
    setDateFilter("all");
    setAmountFilter("all");
  };

  const applyFilters = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFilterModalVisible(false);
  };

  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const getTransactionStatus = (transaction) => {
    const amount = parseFloat(transaction.amount);
    if (amount > 1000) return { label: "Tamamlandı", color: "#4ADE80", icon: "check-circle" };
    if (amount > 500) return { label: "İşlemde", color: "#FBBF24", icon: "clock" };
    return { label: "Tamamlandı", color: "#4ADE80", icon: "check-circle" };
  };

  const FilterChip = ({ label, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { backgroundColor: isActive ? colors.PRIMARY : colors.SURFACE },
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        { color: isActive ? "#FFFFFF" : colors.TEXT_SECONDARY }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Son Islemler</Text>
        <View style={styles.headerActions}>
          {/* Filter Button */}
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              { backgroundColor: hasActiveFilters ? colors.PRIMARY : colors.SURFACE }
            ]} 
            onPress={openFilterModal}
          >
            <Icon 
              name="sliders" 
              size={16} 
              color={hasActiveFilters ? "#FFFFFF" : colors.TEXT_SECONDARY} 
            />
            {hasActiveFilters && (
              <View style={[styles.filterBadge, { backgroundColor: "#FFFFFF" }]}>
                <Text style={[styles.filterBadgeText, { color: colors.PRIMARY }]}>
                  {[typeFilter, dateFilter, amountFilter].filter(f => f !== "all").length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          {hasMore && (
            <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
              <Text style={[styles.seeAllText, { color: colors.ACCENT }]}>Tumunu Gor</Text>
              <Icon name="chevron-right" size={IconSize.sm} color={colors.ACCENT} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {typeFilter !== "all" && (
              <View style={[styles.activeFilter, { backgroundColor: `${colors.PRIMARY}15` }]}>
                <Text style={[styles.activeFilterText, { color: colors.PRIMARY }]}>
                  {FILTER_TYPES.find(f => f.id === typeFilter)?.label}
                </Text>
                <TouchableOpacity onPress={() => setTypeFilter("all")}>
                  <Icon name="x" size={14} color={colors.PRIMARY} />
                </TouchableOpacity>
              </View>
            )}
            {dateFilter !== "all" && (
              <View style={[styles.activeFilter, { backgroundColor: `${colors.PRIMARY}15` }]}>
                <Text style={[styles.activeFilterText, { color: colors.PRIMARY }]}>
                  {DATE_FILTERS.find(f => f.id === dateFilter)?.label}
                </Text>
                <TouchableOpacity onPress={() => setDateFilter("all")}>
                  <Icon name="x" size={14} color={colors.PRIMARY} />
                </TouchableOpacity>
              </View>
            )}
            {amountFilter !== "all" && (
              <View style={[styles.activeFilter, { backgroundColor: `${colors.PRIMARY}15` }]}>
                <Text style={[styles.activeFilterText, { color: colors.PRIMARY }]}>
                  {AMOUNT_FILTERS.find(f => f.id === amountFilter)?.label}
                </Text>
                <TouchableOpacity onPress={() => setAmountFilter("all")}>
                  <Icon name="x" size={14} color={colors.PRIMARY} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity 
              style={[styles.clearAllButton, { backgroundColor: `${colors.ERROR}15` }]}
              onPress={clearFilters}
            >
              <Text style={[styles.clearAllText, { color: colors.ERROR }]}>Temizle</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Results Count */}
      {hasActiveFilters && (
        <Text style={[styles.resultsCount, { color: colors.TEXT_SECONDARY }]}>
          {filteredTransactions.length} sonuç bulundu
        </Text>
      )}

      {filteredTransactions.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Icon name="search" size={32} color={colors.GRAY_400} />
          <Text style={[styles.noResultsText, { color: colors.TEXT_SECONDARY }]}>
            Filtrelerle eşleşen işlem bulunamadı
          </Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={[styles.clearFiltersLink, { color: colors.PRIMARY }]}>
              Filtreleri Temizle
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
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
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.ACCENT}
                colors={[colors.ACCENT, colors.PRIMARY]}
              />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeFilterModal}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: colors.OVERLAY }]}
          activeOpacity={1}
          onPress={closeFilterModal}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => {}}
            style={[styles.filterModalContent, { backgroundColor: colors.SURFACE }]}
          >
            <View style={styles.modalHandle}>
              <View style={[styles.handleBar, { backgroundColor: colors.GRAY_300 }]} />
            </View>

            <View style={styles.filterModalHeader}>
              <Text style={[styles.filterModalTitle, { color: colors.TEXT_PRIMARY }]}>
                İşlemleri Filtrele
              </Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={[styles.clearText, { color: colors.ERROR }]}>Sıfırla</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Type Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.TEXT_PRIMARY }]}>
                  İşlem Türü
                </Text>
                <View style={styles.filterOptions}>
                  {FILTER_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.filterOption,
                        { 
                          backgroundColor: typeFilter === type.id ? colors.PRIMARY : colors.BACKGROUND,
                          borderColor: typeFilter === type.id ? colors.PRIMARY : colors.BORDER,
                        }
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setTypeFilter(type.id);
                      }}
                    >
                      <Icon 
                        name={type.icon} 
                        size={18} 
                        color={typeFilter === type.id ? "#FFFFFF" : colors.TEXT_SECONDARY} 
                      />
                      <Text style={[
                        styles.filterOptionText,
                        { color: typeFilter === type.id ? "#FFFFFF" : colors.TEXT_PRIMARY }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.TEXT_PRIMARY }]}>
                  Tarih Aralığı
                </Text>
                <View style={styles.filterChips}>
                  {DATE_FILTERS.map((date) => (
                    <FilterChip
                      key={date.id}
                      label={date.label}
                      isActive={dateFilter === date.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setDateFilter(date.id);
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* Amount Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: colors.TEXT_PRIMARY }]}>
                  Tutar Aralığı
                </Text>
                <View style={styles.filterChips}>
                  {AMOUNT_FILTERS.map((amount) => (
                    <FilterChip
                      key={amount.id}
                      label={amount.label}
                      isActive={amountFilter === amount.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setAmountFilter(amount.id);
                      }}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Apply Button */}
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.PRIMARY }]}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>
                Uygula ({filteredTransactions.length} sonuç)
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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
                <Icon name="x" size={IconSize.md} color={colors.TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <>
                {/* Status Badge */}
                {(() => {
                  const status = getTransactionStatus(selectedTransaction);
                  return (
                    <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
                      <Icon name={status.icon} size={14} color={status.color} />
                      <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  );
                })()}

                <View style={styles.modalBody}>
                  {/* Amount */}
                  <View style={[styles.amountContainer, { backgroundColor: colors.BACKGROUND }]}>
                    <Text style={[styles.amountLabel, { color: colors.TEXT_SECONDARY }]}>İşlem Tutarı</Text>
                    <Text style={[
                      styles.amountValue, 
                      { color: parseFloat(selectedTransaction.amount) > 0 ? colors.SUCCESS : colors.ERROR }
                    ]}>
                      {parseFloat(selectedTransaction.amount) > 0 ? "+" : ""}₺{formatAmount(Math.abs(parseFloat(selectedTransaction.amount)))}
                    </Text>
                  </View>

                  {/* Details */}
                  <View style={[styles.detailRow, { borderBottomColor: colors.BORDER, borderBottomWidth: 1 }]}>
                    <View style={[styles.detailIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
                      <Icon name="user" size={16} color={colors.PRIMARY} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={[styles.detailLabel, { color: colors.TEXT_SECONDARY }]}>Kişi</Text>
                      <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>{selectedTransaction.name}</Text>
                    </View>
                  </View>

                  <View style={[styles.detailRow, { borderBottomColor: colors.BORDER, borderBottomWidth: 1 }]}>
                    <View style={[styles.detailIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
                      <Icon name="calendar" size={16} color={colors.PRIMARY} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={[styles.detailLabel, { color: colors.TEXT_SECONDARY }]}>Tarih</Text>
                      <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>{selectedTransaction.dateText || "Bugün"}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={[styles.detailIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
                      <Icon name="hash" size={16} color={colors.PRIMARY} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={[styles.detailLabel, { color: colors.TEXT_SECONDARY }]}>İşlem No</Text>
                      <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>TRX-{selectedTransaction.id}</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.secondaryBtn, { borderColor: colors.BORDER }]}
                    onPress={closeModal}
                  >
                    <Icon name="share-2" size={16} color={colors.TEXT_PRIMARY} />
                    <Text style={[styles.secondaryBtnText, { color: colors.TEXT_PRIMARY }]}>Paylaş</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.primaryBtn, { backgroundColor: colors.PRIMARY }]}
                    onPress={closeModal}
                  >
                    <Text style={styles.primaryBtnText}>Tekrarla</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...TextStyles.h4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  filterBadge: {
    marginLeft: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    ...TextStyles.labelMedium,
    marginRight: 2,
  },
  activeFiltersContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  activeFilter: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
    gap: Spacing.xxs,
  },
  activeFilterText: {
    ...TextStyles.caption,
    fontWeight: "500",
  },
  clearAllButton: {
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  clearAllText: {
    ...TextStyles.caption,
    fontWeight: "600",
  },
  resultsCount: {
    ...TextStyles.caption,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    gap: Spacing.sm,
  },
  noResultsText: {
    ...TextStyles.bodyMedium,
  },
  clearFiltersLink: {
    ...TextStyles.labelMedium,
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
  filterModalContent: {
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    paddingBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
    maxHeight: "80%",
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
  filterModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  filterModalTitle: {
    ...TextStyles.h3,
  },
  clearText: {
    ...TextStyles.labelMedium,
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  filterSectionTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.sm,
  },
  filterOptions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  filterOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.xxs,
  },
  filterOptionText: {
    ...TextStyles.labelSmall,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  filterChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  filterChipText: {
    ...TextStyles.labelSmall,
  },
  applyButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  applyButtonText: {
    ...TextStyles.labelLarge,
    color: "#FFFFFF",
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
