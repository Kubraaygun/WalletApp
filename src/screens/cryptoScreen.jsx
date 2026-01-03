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
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

// Mock kripto verileri (gerçek uygulamada CoinGecko API kullanılır)
const MOCK_CRYPTO_DATA = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 1850000,
    change24h: 2.45,
    icon: "circle",
    color: "#F7931A",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 98500,
    change24h: -1.23,
    icon: "hexagon",
    color: "#627EEA",
  },
  {
    id: "binance",
    symbol: "BNB",
    name: "BNB",
    price: 12400,
    change24h: 0.87,
    icon: "square",
    color: "#F3BA2F",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 4850,
    change24h: 5.67,
    icon: "zap",
    color: "#00FFA3",
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    price: 18.5,
    change24h: -0.45,
    icon: "target",
    color: "#0033AD",
  },
];

const CryptoCard = ({ crypto, index }) => {
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
    <FadeSlide delay={index * 100} style={styles.cryptoCard}>
      <View style={styles.cryptoLeft}>
        <View style={[styles.cryptoIcon, { backgroundColor: `${crypto.color}20` }]}>
          <Icon name={crypto.icon} size={IconSize.md} color={crypto.color} />
        </View>
        <View style={styles.cryptoInfo}>
          <Text style={styles.cryptoName}>{crypto.name}</Text>
          <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
        </View>
      </View>
      <View style={styles.cryptoRight}>
        <Text style={styles.cryptoPrice}>{formatPrice(crypto.price)}</Text>
        <View style={[styles.changeBadge, isPositive ? styles.positive : styles.negative]}>
          <Icon
            name={isPositive ? "trending-up" : "trending-down"}
            size={12}
            color={isPositive ? Colors.SUCCESS : Colors.ERROR}
          />
          <Text style={[styles.changeText, isPositive ? styles.positiveText : styles.negativeText]}>
            {isPositive ? "+" : ""}{crypto.change24h.toFixed(2)}%
          </Text>
        </View>
      </View>
    </FadeSlide>
  );
};

const CryptoScreen = ({ navigation }) => {
  const [cryptoData, setCryptoData] = useState(MOCK_CRYPTO_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simüle edilen API çağrısı
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Rastgele fiyat değişimleri
    setCryptoData(
      MOCK_CRYPTO_DATA.map((crypto) => ({
        ...crypto,
        change24h: (Math.random() - 0.5) * 10,
      }))
    );
    setRefreshing(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kripto Fiyatları</Text>
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
            tintColor={Colors.PRIMARY}
          />
        }
      >
        {/* Market Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Piyasa Özeti</Text>
          <View style={styles.overviewStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₺2.4T</Text>
              <Text style={styles.statLabel}>Toplam Piyasa</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₺89.5B</Text>
              <Text style={styles.statLabel}>24s Hacim</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.SUCCESS }]}>+1.2%</Text>
              <Text style={styles.statLabel}>24s Değişim</Text>
            </View>
          </View>
        </View>

        {/* Crypto List */}
        <Text style={styles.sectionTitle}>Popüler Kriptolar</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />
        ) : (
          cryptoData.map((crypto, index) => (
            <CryptoCard key={crypto.id} crypto={crypto} index={index} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.SURFACE,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...TextStyles.h3,
    color: Colors.TEXT_PRIMARY,
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
    backgroundColor: Colors.SURFACE,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  overviewTitle: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
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
    color: Colors.TEXT_PRIMARY,
  },
  statLabel: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.BORDER,
  },
  sectionTitle: {
    ...TextStyles.h4,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.md,
  },
  loader: {
    marginTop: Spacing.xl,
  },
  cryptoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.CARD,
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
    color: Colors.TEXT_PRIMARY,
  },
  cryptoSymbol: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
  },
  cryptoRight: {
    alignItems: "flex-end",
  },
  cryptoPrice: {
    ...TextStyles.labelLarge,
    color: Colors.TEXT_PRIMARY,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xxs,
  },
  positive: {
    backgroundColor: `${Colors.SUCCESS}15`,
  },
  negative: {
    backgroundColor: `${Colors.ERROR}15`,
  },
  changeText: {
    ...TextStyles.labelSmall,
    marginLeft: 2,
  },
  positiveText: {
    color: Colors.SUCCESS,
  },
  negativeText: {
    color: Colors.ERROR,
  },
});

export default CryptoScreen;
