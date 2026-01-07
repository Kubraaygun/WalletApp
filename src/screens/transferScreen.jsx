import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Feather as Icon } from "@expo/vector-icons";
import { addTransaction } from "../store/walletSlice";
import { walletService } from "../services";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize, scale, verticalScale, moderateScale } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

// Components
import CustomTextInput from "../components/customTextInput";
import CustomButton from "../components/customButton";
import BalanceDisplay from "../components/transferScreen/balancaDisplay";
import TransferModal from "../components/transferScreen/transferModal";
import PhoneValidationComponent from "../components/isPhoneNumberValid";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PRESET_AMOUNTS = [100, 500, 1000, 2500];
const MIN_AMOUNT = 10;

const TransferScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.wallet);
  const { colors, isDark } = useTheme();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePresetAmount = (presetAmount) => {
    setAmount(presetAmount.toString());
  };

  const handleSubmit = () => {
    const isPhoneValid = PhoneValidationComponent({ phoneNumber });
    if (!isPhoneValid) return;

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount < MIN_AMOUNT) {
      Alert.alert("Hata", `Minimum transfer tutari ${MIN_AMOUNT} TL olmalidir.`);
      return;
    }

    if (parsedAmount > balance) {
      Alert.alert("Yetersiz Bakiye", "Transfer tutari bakiyenizden fazla olamaz.");
      return;
    }

    setConfirmData({ phoneNumber, amount: parsedAmount, description });
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      dispatch(
        addTransaction({
          receiver: confirmData.phoneNumber,
          amount: confirmData.amount,
          description: confirmData.description,
          type: "outgoing",
        })
      );

      setIsModalVisible(false);

      navigation.navigate("ResultScreen", {
        success: true,
        phoneNumber: confirmData.phoneNumber,
        amount: confirmData.amount,
        description: confirmData.description,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Transfer error:", error);
      Alert.alert("Hata", error.message || "Islem sirasinda bir hata olustu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Responsive font size for amount input
  const amountFontSize = SCREEN_WIDTH < 375 ? 28 : moderateScale(32);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.SURFACE }]} onPress={handleBack}>
            <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Para Gonder</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Amount Section */}
          <View style={[styles.amountSection, { backgroundColor: colors.SURFACE }]}>
            <Text style={[styles.sectionLabel, { color: colors.TEXT_SECONDARY }]}>Tutar</Text>
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: colors.TEXT_PRIMARY, fontSize: amountFontSize }]}>₺</Text>
              <CustomTextInput
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                containerStyle={styles.amountInput}
                inputStyle={[
                  styles.amountInputText, 
                  { 
                    color: colors.TEXT_PRIMARY, 
                    fontSize: amountFontSize,
                    height: moderateScale(60) 
                  }
                ]}
                size="lg"
              />
            </View>

            {/* Preset Amounts */}
            <View style={styles.presetContainer}>
              {PRESET_AMOUNTS.map((presetAmount) => (
                <TouchableOpacity
                  key={presetAmount}
                  style={[
                    styles.presetButton,
                    { backgroundColor: colors.GRAY_100 },
                    amount === presetAmount.toString() && { backgroundColor: colors.ACCENT },
                  ]}
                  onPress={() => handlePresetAmount(presetAmount)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      { color: colors.TEXT_SECONDARY },
                      amount === presetAmount.toString() && { color: colors.WHITE },
                    ]}
                  >
                    ₺{presetAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recipient Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.TEXT_SECONDARY }]}>Alici Bilgileri</Text>
            <CustomTextInput
              label="Telefon Numarasi"
              placeholder="0555 555 55 55"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              leftIcon="phone"
            />
            <CustomTextInput
              label="Aciklama (Opsiyonel)"
              placeholder="Transfer aciklamasi"
              value={description}
              onChangeText={setDescription}
              leftIcon="file-text"
            />
          </View>

          {/* Balance Display */}
          <BalanceDisplay balance={balance} />

          {/* Submit Button */}
          <CustomButton
            title="Devam Et"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            disabled={!phoneNumber || !amount || isLoading}
            loading={isLoading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
 
      {/* Confirmation Modal */}
      <TransferModal
        visible={isModalVisible}
        confirmData={confirmData}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
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
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...TextStyles.h3,
  },
  headerSpacer: {
    width: moderateScale(44),
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  amountSection: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionLabel: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.sm,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontWeight: "700",
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    marginBottom: 0,
  },
  amountInputText: {
    fontWeight: "700",
  },
  presetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  presetButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.xxs,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  presetText: {
    ...TextStyles.labelMedium,
  },
  section: {
    marginBottom: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});

export default TransferScreen;
