import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

// Mock döviz kurları (gerçek uygulamada API kullanılır)
const EXCHANGE_RATES = {
  TRY: { symbol: "₺", name: "Türk Lirası", rate: 1 },
  USD: { symbol: "$", name: "ABD Doları", rate: 0.031 },
  EUR: { symbol: "€", name: "Euro", rate: 0.028 },
  GBP: { symbol: "£", name: "İngiliz Sterlini", rate: 0.024 },
  JPY: { symbol: "¥", name: "Japon Yeni", rate: 4.65 },
  CHF: { symbol: "₣", name: "İsviçre Frangı", rate: 0.027 },
};

const CurrencyButton = ({ currency, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.currencyButton, isSelected && styles.currencyButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.currencySymbol, isSelected && styles.currencySymbolActive]}>
      {EXCHANGE_RATES[currency].symbol}
    </Text>
    <Text style={[styles.currencyCode, isSelected && styles.currencyCodeActive]}>
      {currency}
    </Text>
  </TouchableOpacity>
);

const CurrencyConverterScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("TRY");
  const [toCurrency, setToCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = () => {
    const numAmount = parseFloat(amount) || 0;
    const fromRate = EXCHANGE_RATES[fromCurrency].rate;
    const toRate = EXCHANGE_RATES[toCurrency].rate;
    
    // TRY üzerinden hesaplama
    const tryAmount = numAmount / fromRate;
    const result = tryAmount * toRate;
    
    setConvertedAmount(result);
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatAmount = (value, currency) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Döviz Çevirici</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* From Section */}
        <FadeSlide delay={0}>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Miktar</Text>
            <View style={styles.inputRow}>
              <Text style={styles.currencyPrefix}>
                {EXCHANGE_RATES[fromCurrency].symbol}
              </Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={Colors.TEXT_TERTIARY}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.currencyList}
            >
              {Object.keys(EXCHANGE_RATES).map((currency) => (
                <CurrencyButton
                  key={currency}
                  currency={currency}
                  isSelected={fromCurrency === currency}
                  onPress={() => setFromCurrency(currency)}
                />
              ))}
            </ScrollView>
          </View>
        </FadeSlide>

        {/* Swap Button */}
        <FadeSlide delay={100}>
          <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
            <Icon name="repeat" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </FadeSlide>

        {/* To Section */}
        <FadeSlide delay={200}>
          <View style={styles.resultCard}>
            <Text style={styles.inputLabel}>Dönüştürülen Miktar</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultSymbol}>
                {EXCHANGE_RATES[toCurrency].symbol}
              </Text>
              <Text style={styles.resultAmount}>
                {formatAmount(convertedAmount, toCurrency)}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.currencyList}
            >
              {Object.keys(EXCHANGE_RATES).map((currency) => (
                <CurrencyButton
                  key={currency}
                  currency={currency}
                  isSelected={toCurrency === currency}
                  onPress={() => setToCurrency(currency)}
                />
              ))}
            </ScrollView>
          </View>
        </FadeSlide>

        {/* Exchange Rate Info */}
        <FadeSlide delay={300}>
          <View style={styles.infoCard}>
            <Icon name="info" size={18} color={Colors.PRIMARY} />
            <Text style={styles.infoText}>
              1 {fromCurrency} = {formatAmount(EXCHANGE_RATES[toCurrency].rate / EXCHANGE_RATES[fromCurrency].rate, toCurrency)} {toCurrency}
            </Text>
          </View>
        </FadeSlide>

        {/* Popular Currencies */}
        <FadeSlide delay={400}>
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>Popüler Çevirmeler</Text>
            {[
              { from: "TRY", to: "USD", amount: 1000 },
              { from: "TRY", to: "EUR", amount: 1000 },
              { from: "USD", to: "TRY", amount: 100 },
            ].map((item, index) => {
              const result =
                (item.amount / EXCHANGE_RATES[item.from].rate) *
                EXCHANGE_RATES[item.to].rate;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.popularItem}
                  onPress={() => {
                    setAmount(String(item.amount));
                    setFromCurrency(item.from);
                    setToCurrency(item.to);
                  }}
                >
                  <Text style={styles.popularFrom}>
                    {EXCHANGE_RATES[item.from].symbol}
                    {item.amount.toLocaleString()} {item.from}
                  </Text>
                  <Icon name="arrow-right" size={16} color={Colors.TEXT_SECONDARY} />
                  <Text style={styles.popularTo}>
                    {EXCHANGE_RATES[item.to].symbol}
                    {formatAmount(result, item.to)} {item.to}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </FadeSlide>
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
  inputCard: {
    backgroundColor: Colors.CARD,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  inputLabel: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyPrefix: {
    ...TextStyles.h2,
    color: Colors.TEXT_PRIMARY,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    ...TextStyles.displayMedium,
    color: Colors.TEXT_PRIMARY,
    padding: 0,
  },
  currencyList: {
    marginTop: Spacing.md,
  },
  currencyButton: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.SURFACE,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    minWidth: 60,
  },
  currencyButtonActive: {
    backgroundColor: Colors.PRIMARY,
  },
  currencySymbol: {
    ...TextStyles.h4,
    color: Colors.TEXT_PRIMARY,
  },
  currencySymbolActive: {
    color: Colors.WHITE,
  },
  currencyCode: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
    marginTop: 2,
  },
  currencyCodeActive: {
    color: "rgba(255,255,255,0.8)",
  },
  swapButton: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.PRIMARY}15`,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Spacing.md,
  },
  resultCard: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  resultSymbol: {
    ...TextStyles.h2,
    color: "rgba(255,255,255,0.8)",
    marginRight: Spacing.xs,
  },
  resultAmount: {
    ...TextStyles.displayLarge,
    color: Colors.WHITE,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.PRIMARY}10`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  infoText: {
    ...TextStyles.bodyMedium,
    color: Colors.PRIMARY,
    marginLeft: Spacing.sm,
  },
  popularSection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...TextStyles.h4,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.md,
  },
  popularItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.CARD,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  popularFrom: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_PRIMARY,
    flex: 1,
  },
  popularTo: {
    ...TextStyles.labelMedium,
    color: Colors.PRIMARY,
    flex: 1,
    textAlign: "right",
  },
});

export default CurrencyConverterScreen;
