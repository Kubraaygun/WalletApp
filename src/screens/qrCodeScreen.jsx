import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Share,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather as Icon } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import * as Haptics from "expo-haptics";
import { useSelector } from "react-redux";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { qrService } from "../services";

const { width } = Dimensions.get("window");
const QR_SIZE = width * 0.6;

const QRCodeScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const qrRef = useRef(null);

  // Generate QR data
  const qrData = qrService.generateQRPaymentData({
    recipient: user?.phone || "+905551234567",
    amount: amount ? parseFloat(amount) : null,
    description: description || null,
    name: user?.name || "Kullanıcı",
  });

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const amountText = amount ? `₺${amount}` : "herhangi bir tutar";
      await Share.share({
        message: `${user?.name || "Kullanıcı"} size ${amountText} için ödeme isteği gönderdi.\n\nÖdeme yapmak için WalletApp'ten QR kodu tarayın.`,
        title: "Ödeme İsteği",
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatAmount = (text) => {
    // Sadece rakam ve nokta izin ver
    const cleaned = text.replace(/[^0-9.]/g, "");
    // Birden fazla noktayı engelle
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts[1];
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>QR Kodum</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Icon name="share-2" size={IconSize.md} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* QR Card */}
        <View style={[styles.qrCard, { backgroundColor: colors.SURFACE }]}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <LinearGradient
              colors={["#667EEA", "#764BA2"]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {(user?.name || "K").charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
            <Text style={[styles.userName, { color: colors.TEXT_PRIMARY }]}>
              {user?.name || "Kullanıcı"}
            </Text>
            <Text style={[styles.userPhone, { color: colors.TEXT_SECONDARY }]}>
              {user?.phone || "+90 555 123 4567"}
            </Text>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={[styles.qrWrapper, { backgroundColor: "#FFFFFF" }]}>
              <QRCode
                value={qrData}
                size={QR_SIZE}
                color="#000000"
                backgroundColor="#FFFFFF"
                getRef={qrRef}
              />
            </View>
          </View>

          {/* Amount Display */}
          {amount ? (
            <View style={styles.amountDisplay}>
              <Text style={[styles.amountLabel, { color: colors.TEXT_SECONDARY }]}>
                Talep Edilen Tutar
              </Text>
              <Text style={[styles.amountValue, { color: colors.PRIMARY }]}>
                ₺{parseFloat(amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ) : (
            <Text style={[styles.anyAmountText, { color: colors.TEXT_SECONDARY }]}>
              Herhangi bir tutar için taranabilir
            </Text>
          )}
        </View>

        {/* Amount Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>
            Tutar Belirle (Opsiyonel)
          </Text>
          <View style={[styles.amountInputContainer, { backgroundColor: colors.SURFACE, borderColor: colors.BORDER }]}>
            <Text style={[styles.currencySymbol, { color: colors.TEXT_PRIMARY }]}>₺</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.TEXT_PRIMARY }]}
              value={amount}
              onChangeText={(text) => setAmount(formatAmount(text))}
              placeholder="0.00"
              placeholderTextColor={colors.GRAY_400}
              keyboardType="decimal-pad"
            />
            {amount ? (
              <TouchableOpacity onPress={() => setAmount("")}>
                <Icon name="x-circle" size={20} color={colors.GRAY_400} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Description Input */}
          <View style={[styles.descriptionInputContainer, { backgroundColor: colors.SURFACE, borderColor: colors.BORDER }]}>
            <Icon name="file-text" size={18} color={colors.GRAY_400} style={styles.descIcon} />
            <TextInput
              style={[styles.descriptionInput, { color: colors.TEXT_PRIMARY }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Açıklama ekle (Opsiyonel)"
              placeholderTextColor={colors.GRAY_400}
              maxLength={50}
            />
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Icon name="info" size={16} color={colors.TEXT_SECONDARY} />
          <Text style={[styles.infoText, { color: colors.TEXT_SECONDARY }]}>
            Bu QR kodu taratarak size ödeme yapılabilir
          </Text>
        </View>
      </View>
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
  shareButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  qrCard: {
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.lg,
    alignItems: "center",
    ...Shadows.lg,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  avatarText: {
    ...TextStyles.h3,
    color: "#FFFFFF",
  },
  userName: {
    ...TextStyles.h4,
    marginBottom: Spacing.xxs,
  },
  userPhone: {
    ...TextStyles.bodySmall,
  },
  qrContainer: {
    padding: Spacing.md,
  },
  qrWrapper: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  amountDisplay: {
    alignItems: "center",
    marginTop: Spacing.md,
  },
  amountLabel: {
    ...TextStyles.caption,
    marginBottom: Spacing.xxs,
  },
  amountValue: {
    ...TextStyles.h2,
    fontWeight: "700",
  },
  anyAmountText: {
    ...TextStyles.bodySmall,
    marginTop: Spacing.sm,
  },
  inputSection: {
    marginTop: Spacing.lg,
  },
  inputLabel: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.sm,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 56,
    marginBottom: Spacing.sm,
  },
  currencySymbol: {
    ...TextStyles.h3,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    ...TextStyles.h4,
    height: "100%",
  },
  descriptionInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  descIcon: {
    marginRight: Spacing.sm,
  },
  descriptionInput: {
    flex: 1,
    ...TextStyles.bodyMedium,
    height: "100%",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  infoText: {
    ...TextStyles.caption,
    marginLeft: Spacing.xs,
  },
});

export default QRCodeScreen;
