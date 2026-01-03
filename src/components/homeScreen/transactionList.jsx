import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import TransactionItem from "./transactionItem";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, IconSize } from "../../utils/spacing";

const TransactionList = ({ transactions, onSeeAll, maxItems = 5 }) => {
  const displayedTransactions = transactions.slice(0, maxItems);
  const hasMore = transactions.length > maxItems;

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
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
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
});

export default TransactionList;
