import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Feather as Icon } from "@expo/vector-icons";
import { addTransaction } from "../store/walletSlice";
import { walletService } from "../services";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

// Components
import CustomTextInput from "../components/customTextInput";
import CustomButton from "../components/customButton";
import BalanceDisplay from "../components/transferScreen/balancaDisplay";
import TransferModal from "../components/transferScreen/transferModal";
import PhoneValidationComponent from "../components/isPhoneNumberValid";

const PRESET_AMOUNTS = [100, 500, 1000, 2500];
const MIN_AMOUNT = 10;

const TransferScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.wallet);

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
      Alert.alert("Hata", `Minimum transfer tutarı ${MIN_AMOUNT} TL olmalıdır.`);
      return;
    }

    if (parsedAmount > balance) {
      Alert.alert("Yetersiz Bakiye", "Transfer tutarı bakiyenizden fazla olamaz.");
      return;
    }

    setConfirmData({ phoneNumber, amount: parsedAmount, description });
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // TODO: Backend hazır olduğunda API çağrısını aktif et
      // const result = await walletService.transfer({
      //   recipientId: confirmData.phoneNumber,
      //   amount: confirmData.amount,
      //   description: confirmData.description,
      // });

      // Lokal state güncelleme (mock mod)
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
      Alert.alert("Hata", error.message || "İşlem sırasında bir hata oluştu.");
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-left" size={IconSize.md} color={Colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Para Gönder</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Amount Section */}
          <View style={styles.amountSection}>
            <Text style={styles.sectionLabel}>Tutar</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₺</Text>
              <CustomTextInput
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.amountInput}
                inputStyle={styles.amountInputText}
              />
            </View>

            {/* Preset Amounts */}
            <View style={styles.presetContainer}>
              {PRESET_AMOUNTS.map((presetAmount) => (
                <TouchableOpacity
                  key={presetAmount}
                  style={[
                    styles.presetButton,
                    amount === presetAmount.toString() && styles.presetButtonActive,
                  ]}
                  onPress={() => handlePresetAmount(presetAmount)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      amount === presetAmount.toString() && styles.presetTextActive,
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
            <Text style={styles.sectionLabel}>Alıcı Bilgileri</Text>
            <CustomTextInput
              label="Telefon Numarası"
              placeholder="0555 555 55 55"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              leftIcon="phone"
            />
            <CustomTextInput
              label="Açıklama (Opsiyonel)"
              placeholder="Transfer açıklaması"
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
    backgroundColor: Colors.BACKGROUND,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.GRAY_100,
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  amountSection: {
    backgroundColor: Colors.SURFACE,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionLabel: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.sm,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    ...TextStyles.displayMedium,
    color: Colors.TEXT_PRIMARY,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    marginBottom: 0,
  },
  amountInputText: {
    ...TextStyles.displayMedium,
    color: Colors.TEXT_PRIMARY,
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
    backgroundColor: Colors.GRAY_100,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  presetButtonActive: {
    backgroundColor: Colors.ACCENT,
  },
  presetText: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
  },
  presetTextActive: {
    color: Colors.WHITE,
  },
  section: {
    marginBottom: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});

export default TransferScreen;
