import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

// Quick amount options
const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

// Mock saved cards
const SAVED_CARDS = [
  { id: "1", last4: "4582", brand: "Visa", expiry: "12/28", icon: "credit-card" },
  { id: "2", last4: "7891", brand: "Mastercard", expiry: "06/27", icon: "credit-card" },
];

const TopUpScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState(SAVED_CARDS[0]?.id);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleQuickAmount = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(value.toString());
  };

  const handleAmountChange = (text) => {
    // Only allow numbers and decimal point - sanitize input
    const sanitized = text.replace(/[^0-9.,]/g, "").replace(",", ".");
    // Limit to 2 decimal places
    const parts = sanitized.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    // Limit max amount to prevent overflow
    const numValue = parseFloat(sanitized);
    if (numValue > 100000) return;
    setAmount(sanitized);
  };

  const handleCardSelect = (cardId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCard(cardId);
  };

  const handleTopUp = async () => {
    const numAmount = parseFloat(amount);
    
    // Validation
    if (!amount || numAmount <= 0) {
      Alert.alert("Hata", "Lütfen geçerli bir tutar girin");
      return;
    }
    
    if (numAmount < 10) {
      Alert.alert("Hata", "Minimum yükleme tutarı ₺10'dur");
      return;
    }
    
    if (numAmount > 50000) {
      Alert.alert("Hata", "Maksimum yükleme tutarı ₺50.000'dir");
      return;
    }
    
    if (!selectedCard) {
      Alert.alert("Hata", "Lütfen bir kart seçin");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      "Para Yükleme Onayı",
      `Bakiyenize ₺${formatAmount(numAmount)} yüklenecek. Onaylıyor musunuz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Onayla",
          onPress: async () => {
            setLoading(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setLoading(false);
            Alert.alert(
              "Başarılı!",
              `₺${formatAmount(numAmount)} bakiyenize eklendi.`,
              [{ text: "Tamam", onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const isValidAmount = amount && parseFloat(amount) >= 10;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Para Yükle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount Input Card */}
          <View style={[styles.amountCard, { backgroundColor: colors.SURFACE }]}>
            <Text style={[styles.amountLabel, { color: colors.TEXT_SECONDARY }]}>
              Yüklenecek Tutar
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: colors.TEXT_PRIMARY }]}>₺</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.TEXT_PRIMARY }]}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0,00"
                placeholderTextColor={colors.GRAY_400}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>
            {amount && parseFloat(amount) < 10 && (
              <Text style={[styles.minAmountWarning, { color: colors.ERROR }]}>
                Minimum yükleme tutarı ₺10
              </Text>
            )}
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountsSection}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
              Hızlı Seçim
            </Text>
            <View style={styles.quickAmountsGrid}>
              {QUICK_AMOUNTS.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.quickAmountButton,
                    { 
                      backgroundColor: amount === value.toString() 
                        ? colors.PRIMARY 
                        : colors.SURFACE,
                      borderColor: amount === value.toString() 
                        ? colors.PRIMARY 
                        : colors.BORDER,
                    }
                  ]}
                  onPress={() => handleQuickAmount(value)}
                >
                  <Text style={[
                    styles.quickAmountText,
                    { color: amount === value.toString() ? "#FFFFFF" : colors.TEXT_PRIMARY }
                  ]}>
                    ₺{value.toLocaleString("tr-TR")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Card Selection */}
          <View style={styles.cardSection}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
              Ödeme Yöntemi
            </Text>
            {SAVED_CARDS.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardOption,
                  { 
                    backgroundColor: colors.SURFACE,
                    borderColor: selectedCard === card.id ? colors.PRIMARY : colors.BORDER,
                    borderWidth: selectedCard === card.id ? 2 : 1,
                  }
                ]}
                onPress={() => handleCardSelect(card.id)}
              >
                <View style={[styles.cardIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
                  <Icon name={card.icon} size={20} color={colors.PRIMARY} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardBrand, { color: colors.TEXT_PRIMARY }]}>
                    {card.brand} •••• {card.last4}
                  </Text>
                  <Text style={[styles.cardExpiry, { color: colors.TEXT_SECONDARY }]}>
                    Son Kullanma: {card.expiry}
                  </Text>
                </View>
                {selectedCard === card.id && (
                  <View style={[styles.checkIcon, { backgroundColor: colors.PRIMARY }]}>
                    <Icon name="check" size={14} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Add New Card */}
            <TouchableOpacity 
              style={[styles.addCardButton, { borderColor: colors.BORDER }]}
              onPress={() => Alert.alert("Bilgi", "Yeni kart ekleme yakında aktif olacak")}
            >
              <Icon name="plus" size={20} color={colors.PRIMARY} />
              <Text style={[styles.addCardText, { color: colors.PRIMARY }]}>
                Yeni Kart Ekle
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Info */}
          <View style={[styles.securityInfo, { backgroundColor: `${colors.SUCCESS}10` }]}>
            <Icon name="shield" size={18} color={colors.SUCCESS} />
            <Text style={[styles.securityText, { color: colors.SUCCESS }]}>
              256-bit SSL şifreleme ile güvenli işlem
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={[styles.bottomContainer, { backgroundColor: colors.BACKGROUND }]}>
          <TouchableOpacity
            style={[
              styles.topUpButton,
              { backgroundColor: isValidAmount ? colors.PRIMARY : colors.GRAY_300 }
            ]}
            onPress={handleTopUp}
            disabled={!isValidAmount || loading}
          >
            {loading ? (
              <Text style={styles.topUpButtonText}>İşleniyor...</Text>
            ) : (
              <>
                <Icon name="plus-circle" size={20} color="#FFFFFF" />
                <Text style={styles.topUpButtonText}>
                  {amount && parseFloat(amount) >= 10 
                    ? `₺${formatAmount(parseFloat(amount))} Yükle`
                    : "Para Yükle"
                  }
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...TextStyles.h3,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  amountCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  amountLabel: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.md,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "600",
    marginRight: Spacing.xs,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "700",
    minWidth: 150,
    textAlign: "center",
  },
  minAmountWarning: {
    ...TextStyles.caption,
    marginTop: Spacing.sm,
  },
  quickAmountsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.sm,
  },
  quickAmountsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  quickAmountButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    minWidth: "30%",
    alignItems: "center",
  },
  quickAmountText: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
  },
  cardSection: {
    marginBottom: Spacing.lg,
  },
  cardOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  cardBrand: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
  },
  cardExpiry: {
    ...TextStyles.caption,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    gap: Spacing.xs,
  },
  addCardText: {
    ...TextStyles.labelMedium,
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  securityText: {
    ...TextStyles.caption,
    flex: 1,
  },
  bottomContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  topUpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  topUpButtonText: {
    ...TextStyles.labelLarge,
    color: "#FFFFFF",
  },
});

export default TopUpScreen;
