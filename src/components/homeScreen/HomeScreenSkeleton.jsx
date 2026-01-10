import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton, { SkeletonCircle, SkeletonText } from "../animations/Skeleton";
import { useTheme } from "../../contexts/ThemeContext";
import { Spacing, BorderRadius } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

/**
 * HomeScreenSkeleton - Full home screen loading placeholder
 */
const HomeScreenSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SkeletonCircle size={48} />
          <View style={styles.headerText}>
            <SkeletonText width={80} height={12} />
            <SkeletonText width={120} height={16} style={styles.marginTop} />
          </View>
        </View>
        <SkeletonCircle size={40} />
      </View>

      {/* Balance Card Skeleton */}
      <View style={[styles.balanceCard, { backgroundColor: colors.GRAY_200 }]}>
        <SkeletonText width={100} height={14} />
        <Skeleton width={180} height={40} style={styles.balanceAmount} borderRadius={8} />
        <View style={styles.balanceFooter}>
          <SkeletonText width={80} height={12} />
          <Skeleton width={60} height={24} borderRadius={12} />
        </View>
      </View>

      {/* Quick Actions Skeleton */}
      <View style={styles.section}>
        <SkeletonText width={120} height={16} style={styles.sectionTitle} />
        <View style={[styles.quickActions, { backgroundColor: colors.SURFACE }]}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.actionItem}>
              <Skeleton width={52} height={52} borderRadius={BorderRadius.lg} />
              <SkeletonText width={50} height={10} style={styles.marginTop} />
            </View>
          ))}
        </View>
      </View>

      {/* Transactions Skeleton */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SkeletonText width={120} height={16} />
          <SkeletonText width={80} height={14} />
        </View>
        {[1, 2, 3, 4].map((i) => (
          <TransactionItemSkeleton key={i} colors={colors} />
        ))}
      </View>
    </View>
  );
};

/**
 * TransactionItemSkeleton - Single transaction loading placeholder
 */
const TransactionItemSkeleton = ({ colors }) => (
  <View style={[styles.transactionItem, { backgroundColor: colors.SURFACE }]}>
    <View style={styles.transactionLeft}>
      <SkeletonCircle size={40} />
      <View style={styles.transactionDetails}>
        <SkeletonText width={100} height={14} />
        <SkeletonText width={70} height={10} style={styles.marginTop} />
      </View>
    </View>
    <SkeletonText width={60} height={14} />
  </View>
);

/**
 * TransactionListSkeleton - Transaction list loading placeholder
 */
export const TransactionListSkeleton = ({ count = 5 }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.transactionList}>
      {Array.from({ length: count }).map((_, i) => (
        <TransactionItemSkeleton key={i} colors={colors} />
      ))}
    </View>
  );
};

/**
 * BalanceCardSkeleton - Balance card loading placeholder
 */
export const BalanceCardSkeleton = () => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.balanceCard, { backgroundColor: colors.GRAY_200 }]}>
      <SkeletonText width={100} height={14} />
      <Skeleton width={180} height={40} style={styles.balanceAmount} borderRadius={8} />
      <View style={styles.balanceFooter}>
        <SkeletonText width={80} height={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: Spacing.sm,
  },
  marginTop: {
    marginTop: Spacing.xs,
  },
  balanceCard: {
    marginHorizontal: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  balanceAmount: {
    marginVertical: Spacing.md,
  },
  balanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  actionItem: {
    alignItems: "center",
    flex: 1,
  },
  transactionList: {
    paddingHorizontal: Spacing.md,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    ...Shadows.xs,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionDetails: {
    marginLeft: Spacing.sm,
  },
});

export default HomeScreenSkeleton;
