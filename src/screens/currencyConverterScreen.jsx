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
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const EXCHANGE_RATES = {
  TRY: { symbol: "₺", name: "Turk Lirasi", rate: 1 },
  USD: { symbol: "$", name: "ABD Dolari", rate: 0.031 },
  EUR: { symbol: "€", name: "Euro", rate: 0.028 },
  GBP: { symbol: "£", name: "Ingiliz Sterlini", rate: 0.024 },
  JPY: { symbol: "¥", name: "Japon Yeni", rate: 4.65 },
  CHF: { symbol: "₣", name: "Isvicre Frangi", rate: 0.027 },
};

const CurrencyButton = ({ currency, isSelected, onPress, colors }) => (
  <TouchableOpacity
    style={[styles.currencyButton, { backgroundColor: isSelected ? colors.PRIMARY : colors.SURFACE }]}
    onPress={onPress}
  >
    <Text style={[styles.currencySymbol, { color: isSelected ? colors.WHITE : colors.TEXT_PRIMARY }]}>
      {EXCHANGE_RATES[currency].symbol}
    </Text>
    <Text style={[styles.currencyCode, { color: isSelected ? "rgba(255,255,255,0.8)" : colors.TEXT_SECONDARY }]}>
      {currency}
    </Text>
  </TouchableOpacity>
);

const CurrencyConverterScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
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

  const formatAmount = (value) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />

      <View style={styles.header}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.SURFACE }]} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Doviz Cevirici</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeSlide delay={0}>
          <View style={[styles.inputCard, { backgroundColor: colors.CARD }]}>
            <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>Miktar</Text>
            <View style={styles.inputRow}>
              <Text style={[styles.currencyPrefix, { color: colors.TEXT_PRIMARY }]}>
                {EXCHANGE_RATES[fromCurrency].symbol}
              </Text>
              <TextInput
                style={[styles.input, { color: colors.TEXT_PRIMARY }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.TEXT_TERTIARY}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyList}>
              {Object.keys(EXCHANGE_RATES).map((currency) => (
                <CurrencyButton
                  key={currency}
                  currency={currency}
                  isSelected={fromCurrency === currency}
                  onPress={() => setFromCurrency(currency)}
                  colors={colors}
                />
              ))}
            </ScrollView>
          </View>
        </FadeSlide>

        <FadeSlide delay={100}>
          <TouchableOpacity style={[styles.swapButton, { backgroundColor: `${colors.PRIMARY}15` }]} onPress={handleSwap}>
            <Icon name="repeat" size={24} color={colors.PRIMARY} />
          </TouchableOpacity>
        </FadeSlide>

        <FadeSlide delay={200}>
          <View style={[styles.resultCard, { backgroundColor: colors.PRIMARY }]}>
            <Text style={styles.inputLabelWhite}>Donusturulen Miktar</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultSymbol}>{EXCHANGE_RATES[toCurrency].symbol}</Text>
              <Text style={styles.resultAmount}>{formatAmount(convertedAmount)}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyList}>
              {Object.keys(EXCHANGE_RATES).map((currency) => (
                <CurrencyButton
                  key={currency}
                  currency={currency}
                  isSelected={toCurrency === currency}
                  onPress={() => setToCurrency(currency)}
                  colors={colors}
                />
              ))}
            </ScrollView>
          </View>
        </FadeSlide>

        <FadeSlide delay={300}>
          <View style={[styles.infoCard, { backgroundColor: `${colors.PRIMARY}10` }]}>
            <Icon name="info" size={18} color={colors.PRIMARY} />
            <Text style={[styles.infoText, { color: colors.PRIMARY }]}>
              1 {fromCurrency} = {formatAmount(EXCHANGE_RATES[toCurrency].rate / EXCHANGE_RATES[fromCurrency].rate)} {toCurrency}
            </Text>
          </View>
        </FadeSlide>

        <FadeSlide delay={400}>
          <View style={styles.popularSection}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Populer Cevirmeler</Text>
            {[
              { from: "TRY", to: "USD", amount: 1000 },
              { from: "TRY", to: "EUR", amount: 1000 },
              { from: "USD", to: "TRY", amount: 100 },
            ].map((item, index) => {
              const result = (item.amount / EXCHANGE_RATES[item.from].rate) * EXCHANGE_RATES[item.to].rate;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.popularItem, { backgroundColor: colors.CARD }]}
                  onPress={() => {
                    setAmount(String(item.amount));
                    setFromCurrency(item.from);
                    setToCurrency(item.to);
                  }}
                >
                  <Text style={[styles.popularFrom, { color: colors.TEXT_PRIMARY }]}>
                    {EXCHANGE_RATES[item.from].symbol}{item.amount.toLocaleString()} {item.from}
                  </Text>
                  <Icon name="arrow-right" size={16} color={colors.TEXT_SECONDARY} />
                  <Text style={[styles.popularTo, { color: colors.PRIMARY }]}>
                    {EXCHANGE_RATES[item.to].symbol}{formatAmount(result)} {item.to}
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
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backButton: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  headerTitle: { ...TextStyles.h3 },
  headerSpacer: { width: 44 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing["2xl"] },
  inputCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.sm },
  inputLabel: { ...TextStyles.labelMedium, marginBottom: Spacing.sm },
  inputLabelWhite: { ...TextStyles.labelMedium, color: "rgba(255,255,255,0.8)", marginBottom: Spacing.sm },
  inputRow: { flexDirection: "row", alignItems: "center" },
  currencyPrefix: { ...TextStyles.h2, marginRight: Spacing.xs },
  input: { flex: 1, ...TextStyles.displayMedium, padding: 0 },
  currencyList: { marginTop: Spacing.md },
  currencyButton: { alignItems: "center", paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, marginRight: Spacing.sm, minWidth: 60 },
  currencySymbol: { ...TextStyles.h4 },
  currencyCode: { ...TextStyles.caption, marginTop: 2 },
  swapButton: { alignSelf: "center", width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", marginVertical: Spacing.md },
  resultCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg },
  resultRow: { flexDirection: "row", alignItems: "baseline" },
  resultSymbol: { ...TextStyles.h2, color: "rgba(255,255,255,0.8)", marginRight: Spacing.xs },
  resultAmount: { ...TextStyles.displayLarge, color: "#FFFFFF" },
  infoCard: { flexDirection: "row", alignItems: "center", borderRadius: BorderRadius.lg, padding: Spacing.md, marginTop: Spacing.lg },
  infoText: { ...TextStyles.bodyMedium, marginLeft: Spacing.sm },
  popularSection: { marginTop: Spacing.xl },
  sectionTitle: { ...TextStyles.h4, marginBottom: Spacing.md },
  popularItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.sm },
  popularFrom: { ...TextStyles.labelMedium, flex: 1 },
  popularTo: { ...TextStyles.labelMedium, flex: 1, textAlign: "right" },
});

export default CurrencyConverterScreen;
