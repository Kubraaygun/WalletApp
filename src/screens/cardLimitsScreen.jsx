import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

const CardLimitsScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const card = route?.params?.card || { 
    name: "Ana Kart", 
    number: "4582",
    dailyLimit: 5000,
    monthlyLimit: 50000,
    onlineLimit: 10000,
  };

  // Limit states
  const [dailyLimit, setDailyLimit] = useState(card.dailyLimit || 5000);
  const [monthlyLimit, setMonthlyLimit] = useState(card.monthlyLimit || 50000);
  const [onlineLimit, setOnlineLimit] = useState(card.onlineLimit || 10000);
  const [contactlessEnabled, setContactlessEnabled] = useState(true);
  const [onlineEnabled, setOnlineEnabled] = useState(true);
  const [internationalEnabled, setInternationalEnabled] = useState(false);

  // Limit ranges
  const DAILY_MAX = 25000;
  const MONTHLY_MAX = 100000;
  const ONLINE_MAX = 50000;

  const handleBack = () => {
    navigation.goBack();
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Başarılı",
      "Kart limitleri güncellendi.",
      [{ text: "Tamam", onPress: () => navigation.goBack() }]
    );
  };

  const LimitSlider = ({ label, description, value, onValueChange, max, step = 500 }) => {
    const percentage = Math.round((value / max) * 100);
    
    return (
      <View style={[styles.limitCard, { backgroundColor: colors.SURFACE }]}>
        <View style={styles.limitHeader}>
          <View>
            <Text style={[styles.limitLabel, { color: colors.TEXT_PRIMARY }]}>{label}</Text>
            <Text style={[styles.limitDescription, { color: colors.TEXT_SECONDARY }]}>
              {description}
            </Text>
          </View>
          <View style={[styles.limitBadge, { backgroundColor: `${colors.PRIMARY}15` }]}>
            <Text style={[styles.limitBadgeText, { color: colors.PRIMARY }]}>
              %{percentage}
            </Text>
          </View>
        </View>
        
        <View style={styles.amountRow}>
          <Text style={[styles.currentAmount, { color: colors.TEXT_PRIMARY }]}>
            ₺{formatAmount(value)}
          </Text>
          <Text style={[styles.maxAmount, { color: colors.TEXT_SECONDARY }]}>
            / ₺{formatAmount(max)}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={(val) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onValueChange(val);
          }}
          minimumTrackTintColor={colors.PRIMARY}
          maximumTrackTintColor={colors.GRAY_200}
          thumbTintColor={colors.PRIMARY}
        />

        <View style={styles.sliderLabels}>
          <Text style={[styles.sliderLabel, { color: colors.TEXT_SECONDARY }]}>₺0</Text>
          <Text style={[styles.sliderLabel, { color: colors.TEXT_SECONDARY }]}>
            ₺{formatAmount(max)}
          </Text>
        </View>
      </View>
    );
  };

  const ToggleOption = ({ icon, label, description, value, onValueChange, color = colors.PRIMARY }) => (
    <TouchableOpacity
      style={[styles.toggleCard, { backgroundColor: colors.SURFACE }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onValueChange(!value);
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.toggleIcon, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View style={styles.toggleContent}>
        <Text style={[styles.toggleLabel, { color: colors.TEXT_PRIMARY }]}>{label}</Text>
        <Text style={[styles.toggleDescription, { color: colors.TEXT_SECONDARY }]}>
          {description}
        </Text>
      </View>
      <View style={[
        styles.toggleSwitch,
        { backgroundColor: value ? colors.SUCCESS : colors.GRAY_300 }
      ]}>
        <View style={[
          styles.toggleThumb,
          { transform: [{ translateX: value ? 20 : 0 }] }
        ]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Kart Limitleri</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Info */}
        <View style={[styles.cardInfo, { backgroundColor: `${colors.PRIMARY}10` }]}>
          <Icon name="credit-card" size={20} color={colors.PRIMARY} />
          <Text style={[styles.cardInfoText, { color: colors.PRIMARY }]}>
            {card.name} •••• {card.number}
          </Text>
        </View>

        {/* Spending Limits */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
          Harcama Limitleri
        </Text>

        <LimitSlider
          label="Günlük Limit"
          description="Bir günde harcayabileceğiniz maksimum tutar"
          value={dailyLimit}
          onValueChange={setDailyLimit}
          max={DAILY_MAX}
        />

        <LimitSlider
          label="Aylık Limit"
          description="Bir ayda harcayabileceğiniz maksimum tutar"
          value={monthlyLimit}
          onValueChange={setMonthlyLimit}
          max={MONTHLY_MAX}
          step={1000}
        />

        <LimitSlider
          label="Online Alışveriş Limiti"
          description="İnternet üzerinden yapılan alışverişler için"
          value={onlineLimit}
          onValueChange={setOnlineLimit}
          max={ONLINE_MAX}
        />

        {/* Security Options */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY, marginTop: Spacing.lg }]}>
          Güvenlik Ayarları
        </Text>

        <ToggleOption
          icon="wifi"
          label="Temassız Ödeme"
          description="NFC ile temassız ödeme yapabilirsiniz"
          value={contactlessEnabled}
          onValueChange={setContactlessEnabled}
          color={colors.PRIMARY}
        />

        <ToggleOption
          icon="globe"
          label="Online Alışveriş"
          description="İnternet üzerinden alışveriş yapabilirsiniz"
          value={onlineEnabled}
          onValueChange={setOnlineEnabled}
          color={colors.SECONDARY}
        />

        <ToggleOption
          icon="map"
          label="Yurt Dışı Kullanım"
          description="Kartınızı yurt dışında kullanabilirsiniz"
          value={internationalEnabled}
          onValueChange={setInternationalEnabled}
          color="#F59E0B"
        />

        {/* Warning */}
        <View style={[styles.warningBox, { backgroundColor: `${colors.WARNING}10` }]}>
          <Icon name="alert-triangle" size={18} color={colors.WARNING} />
          <Text style={[styles.warningText, { color: colors.WARNING }]}>
            Limit değişiklikleri anında uygulanır ve geri alınamaz.
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.BACKGROUND }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.PRIMARY }]}
          onPress={handleSave}
        >
          <Icon name="check" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
        </TouchableOpacity>
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
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  cardInfoText: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
  },
  sectionTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.sm,
  },
  limitCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  limitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  limitLabel: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
    marginBottom: 2,
  },
  limitDescription: {
    ...TextStyles.caption,
  },
  limitBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  limitBadgeText: {
    ...TextStyles.caption,
    fontWeight: "700",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.xs,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: "700",
  },
  maxAmount: {
    ...TextStyles.bodySmall,
    marginLeft: Spacing.xxs,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    ...TextStyles.caption,
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  toggleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  toggleLabel: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
    marginBottom: 2,
  },
  toggleDescription: {
    ...TextStyles.caption,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    ...Shadows.sm,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  warningText: {
    ...TextStyles.caption,
    flex: 1,
  },
  bottomContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  saveButtonText: {
    ...TextStyles.labelLarge,
    color: "#FFFFFF",
  },
});

export default CardLimitsScreen;
