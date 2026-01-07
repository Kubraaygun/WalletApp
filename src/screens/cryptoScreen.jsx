import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const MOCK_CRYPTO_DATA = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 1850000, change24h: 2.45, icon: "circle", color: "#F7931A" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 98500, change24h: -1.23, icon: "hexagon", color: "#627EEA" },
  { id: "binance", symbol: "BNB", name: "BNB", price: 12400, change24h: 0.87, icon: "square", color: "#F3BA2F" },
  { id: "solana", symbol: "SOL", name: "Solana", price: 4850, change24h: 5.67, icon: "zap", color: "#00FFA3" },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 18.5, change24h: -0.45, icon: "target", color: "#0033AD" },
];

const CryptoCard = ({ crypto, index, colors }) => {
  const isPositive = crypto.change24h >= 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: price < 100 ? 2 : 0,
      maximumFractionDigits: price < 100 ? 2 : 0,
    }).format(price);
  };

  return (
    <FadeSlide delay={index * 100} style={[styles.cryptoCard, { backgroundColor: colors.CARD }]}>
      <View style={styles.cryptoLeft}>
        <View style={[styles.cryptoIcon, { backgroundColor: `${crypto.color}20` }]}>
          <Icon name={crypto.icon} size={IconSize.md} color={crypto.color} />
        </View>
        <View style={styles.cryptoInfo}>
          <Text style={[styles.cryptoName, { color: colors.TEXT_PRIMARY }]}>{crypto.name}</Text>
          <Text style={[styles.cryptoSymbol, { color: colors.TEXT_SECONDARY }]}>{crypto.symbol}</Text>
        </View>
      </View>
      <View style={styles.cryptoRight}>
        <Text style={[styles.cryptoPrice, { color: colors.TEXT_PRIMARY }]}>{formatPrice(crypto.price)}</Text>
        <View style={[styles.changeBadge, { backgroundColor: `${isPositive ? colors.SUCCESS : colors.ERROR}15` }]}>
          <Icon
            name={isPositive ? "trending-up" : "trending-down"}
            size={12}
            color={isPositive ? colors.SUCCESS : colors.ERROR}
          />
          <Text style={[styles.changeText, { color: isPositive ? colors.SUCCESS : colors.ERROR }]}>
            {isPositive ? "+" : ""}{crypto.change24h.toFixed(2)}%
          </Text>
        </View>
      </View>
    </FadeSlide>
  );
};

const CryptoScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [cryptoData, setCryptoData] = useState(MOCK_CRYPTO_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCryptoData(
      MOCK_CRYPTO_DATA.map((crypto) => ({
        ...crypto,
        change24h: (Math.random() - 0.5) * 10,
      }))
    );
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Kripto Fiyatlari</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.PRIMARY}
          />
        }
      >
        {/* Market Overview */}
        <View style={[styles.overviewCard, { backgroundColor: colors.SURFACE }]}>
          <Text style={[styles.overviewTitle, { color: colors.TEXT_SECONDARY }]}>Piyasa Ozeti</Text>
          <View style={styles.overviewStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.TEXT_PRIMARY }]}>₺2.4T</Text>
              <Text style={[styles.statLabel, { color: colors.TEXT_SECONDARY }]}>Toplam Piyasa</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.BORDER }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.TEXT_PRIMARY }]}>₺89.5B</Text>
              <Text style={[styles.statLabel, { color: colors.TEXT_SECONDARY }]}>24s Hacim</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.BORDER }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.SUCCESS }]}>+1.2%</Text>
              <Text style={[styles.statLabel, { color: colors.TEXT_SECONDARY }]}>24s Degisim</Text>
            </View>
          </View>
        </View>

        {/* Crypto List */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Populer Kriptolar</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.PRIMARY} style={styles.loader} />
        ) : (
          cryptoData.map((crypto, index) => (
            <CryptoCard key={crypto.id} crypto={crypto} index={index} colors={colors} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    ...TextStyles.h3,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  overviewCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  overviewTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.md,
  },
  overviewStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    ...TextStyles.h4,
  },
  statLabel: {
    ...TextStyles.caption,
    marginTop: Spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  sectionTitle: {
    ...TextStyles.h4,
    marginBottom: Spacing.md,
  },
  loader: {
    marginTop: Spacing.xl,
  },
  cryptoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  cryptoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cryptoIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cryptoInfo: {
    marginLeft: Spacing.sm,
  },
  cryptoName: {
    ...TextStyles.labelLarge,
  },
  cryptoSymbol: {
    ...TextStyles.caption,
  },
  cryptoRight: {
    alignItems: "flex-end",
  },
  cryptoPrice: {
    ...TextStyles.labelLarge,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xxs,
  },
  changeText: {
    ...TextStyles.labelSmall,
    marginLeft: 2,
  },
});

export default CryptoScreen;
