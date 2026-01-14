import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const CAMPAIGNS = [
  {
    id: "1",
    title: "Market Alışverişinde %10 Cashback",
    description: "Migros, CarrefourSA ve A101'de yapacağınız alışverişlerde %10 cashback kazanın",
    category: "market",
    cashback: 10,
    maxCashback: 100,
    validUntil: "31 Ocak 2026",
    gradient: ["#10B981", "#059669"],
    icon: "shopping-cart",
    terms: "Minimum 100₺ alışverişlerde geçerlidir. Aylık maksimum 100₺ cashback.",
  },
  {
    id: "2",
    title: "Akaryakıtta 50₺ İndirim",
    description: "BP ve Shell istasyonlarında 200₺ ve üzeri yakıt alımında 50₺ hediye",
    category: "fuel",
    cashback: 50,
    maxCashback: 50,
    validUntil: "15 Şubat 2026",
    gradient: ["#F59E0B", "#D97706"],
    icon: "truck",
    terms: "Her müşteri için tek seferlik geçerlidir.",
  },
  {
    id: "3",
    title: "Restoran Harcamalarında %15",
    description: "Seçili restoranlarda %15 cashback fırsatı",
    category: "food",
    cashback: 15,
    maxCashback: 75,
    validUntil: "28 Şubat 2026",
    gradient: ["#EF4444", "#DC2626"],
    icon: "coffee",
    terms: "Hafta içi öğle saatlerinde geçerlidir.",
  },
  {
    id: "4",
    title: "Online Alışverişte %5 Cashback",
    description: "Trendyol, Hepsiburada ve Amazon'da %5 cashback",
    category: "online",
    cashback: 5,
    maxCashback: 200,
    validUntil: "31 Mart 2026",
    gradient: ["#8B5CF6", "#7C3AED"],
    icon: "globe",
    terms: "Tüm online alışverişlerde geçerlidir.",
  },
  {
    id: "5",
    title: "Fatura Ödemelerinde Puan",
    description: "Her fatura ödemesinde 100 puan kazanın",
    category: "bills",
    cashback: 100,
    maxCashback: 500,
    validUntil: "Süresiz",
    gradient: ["#3B82F6", "#2563EB"],
    icon: "file-text",
    terms: "Fatura başına 100 puan. Puanlar alışverişte kullanılabilir.",
    isPoints: true,
  },
];

const CATEGORIES = [
  { id: "all", label: "Tümü", icon: "grid" },
  { id: "market", label: "Market", icon: "shopping-cart" },
  { id: "food", label: "Yemek", icon: "coffee" },
  { id: "fuel", label: "Akaryakıt", icon: "truck" },
  { id: "online", label: "Online", icon: "globe" },
  { id: "bills", label: "Fatura", icon: "file-text" },
];

const CampaignsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const handleBack = () => navigation.goBack();

  const filteredCampaigns = selectedCategory === "all"
    ? CAMPAIGNS
    : CAMPAIGNS.filter((c) => c.category === selectedCategory);

  const handleCampaignPress = (campaign) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCampaign(campaign);
    setDetailModalVisible(true);
  };

  const handleActivateCampaign = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDetailModalVisible(false);
    Alert.alert(
      "Kampanya Aktif! 🎉",
      `"${selectedCampaign?.title}" kampanyası hesabınıza tanımlandı.`,
      [{ text: "Harika!" }]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Kampanyalar</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === cat.id ? colors.PRIMARY : colors.SURFACE,
              }
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedCategory(cat.id);
            }}
          >
            <Icon
              name={cat.icon}
              size={16}
              color={selectedCategory === cat.id ? "#FFF" : colors.TEXT_SECONDARY}
            />
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === cat.id ? "#FFF" : colors.TEXT_PRIMARY }
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cashback Summary */}
        <FadeSlide delay={0}>
          <LinearGradient
            colors={[colors.PRIMARY, "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Bu Ay Kazandığınız</Text>
                <Text style={styles.summaryAmount}>₺127.50</Text>
              </View>
              <View style={styles.summaryIcon}>
                <Icon name="gift" size={32} color="rgba(255,255,255,0.9)" />
              </View>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>5</Text>
                <Text style={styles.summaryStatLabel}>Aktif Kampanya</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>1,250</Text>
                <Text style={styles.summaryStatLabel}>Toplam Puan</Text>
              </View>
            </View>
          </LinearGradient>
        </FadeSlide>

        {/* Campaigns List */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
          {selectedCategory === "all" ? "Tüm Kampanyalar" : `${CATEGORIES.find(c => c.id === selectedCategory)?.label} Kampanyaları`}
        </Text>
        
        {filteredCampaigns.map((campaign, index) => (
          <FadeSlide key={campaign.id} delay={index * 50}>
            <TouchableOpacity
              style={[styles.campaignCard, { backgroundColor: colors.SURFACE }]}
              onPress={() => handleCampaignPress(campaign)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={campaign.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.campaignBadge}
              >
                <Icon name={campaign.icon} size={20} color="#FFF" />
              </LinearGradient>
              <View style={styles.campaignContent}>
                <Text style={[styles.campaignTitle, { color: colors.TEXT_PRIMARY }]} numberOfLines={1}>
                  {campaign.title}
                </Text>
                <Text style={[styles.campaignDesc, { color: colors.TEXT_SECONDARY }]} numberOfLines={2}>
                  {campaign.description}
                </Text>
                <View style={styles.campaignMeta}>
                  <View style={[styles.cashbackBadge, { backgroundColor: `${campaign.gradient[0]}15` }]}>
                    <Text style={[styles.cashbackText, { color: campaign.gradient[0] }]}>
                      {campaign.isPoints ? `${campaign.cashback} Puan` : `%${campaign.cashback}`}
                    </Text>
                  </View>
                  <Text style={[styles.validText, { color: colors.GRAY_400 }]}>
                    {campaign.validUntil}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color={colors.GRAY_400} />
            </TouchableOpacity>
          </FadeSlide>
        ))}

        {filteredCampaigns.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="inbox" size={48} color={colors.GRAY_300} />
            <Text style={[styles.emptyText, { color: colors.TEXT_SECONDARY }]}>
              Bu kategoride kampanya bulunamadı
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} animationType="slide" transparent onRequestClose={() => setDetailModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.BACKGROUND }]}>
            {selectedCampaign && (
              <>
                <View style={styles.modalHeader}>
                  <LinearGradient
                    colors={selectedCampaign.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalBadge}
                  >
                    <Icon name={selectedCampaign.icon} size={32} color="#FFF" />
                  </LinearGradient>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setDetailModalVisible(false)}>
                    <Icon name="x" size={24} color={colors.TEXT_PRIMARY} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>
                  {selectedCampaign.title}
                </Text>
                <Text style={[styles.modalDesc, { color: colors.TEXT_SECONDARY }]}>
                  {selectedCampaign.description}
                </Text>

                <View style={styles.modalStats}>
                  <View style={[styles.modalStatCard, { backgroundColor: colors.SURFACE }]}>
                    <Text style={[styles.modalStatValue, { color: selectedCampaign.gradient[0] }]}>
                      {selectedCampaign.isPoints ? selectedCampaign.cashback : `%${selectedCampaign.cashback}`}
                    </Text>
                    <Text style={[styles.modalStatLabel, { color: colors.TEXT_SECONDARY }]}>
                      {selectedCampaign.isPoints ? "Puan" : "Cashback"}
                    </Text>
                  </View>
                  <View style={[styles.modalStatCard, { backgroundColor: colors.SURFACE }]}>
                    <Text style={[styles.modalStatValue, { color: colors.TEXT_PRIMARY }]}>
                      {selectedCampaign.isPoints ? selectedCampaign.maxCashback : `₺${selectedCampaign.maxCashback}`}
                    </Text>
                    <Text style={[styles.modalStatLabel, { color: colors.TEXT_SECONDARY }]}>
                      {selectedCampaign.isPoints ? "Maks. Puan" : "Maks. Kazanç"}
                    </Text>
                  </View>
                </View>

                <View style={[styles.termsBox, { backgroundColor: `${colors.WARNING}10` }]}>
                  <Icon name="info" size={16} color={colors.WARNING} />
                  <Text style={[styles.termsText, { color: colors.WARNING }]}>
                    {selectedCampaign.terms}
                  </Text>
                </View>

                <Text style={[styles.validUntil, { color: colors.TEXT_SECONDARY }]}>
                  Geçerlilik: {selectedCampaign.validUntil}
                </Text>

                <TouchableOpacity
                  style={[styles.activateButton, { backgroundColor: selectedCampaign.gradient[0] }]}
                  onPress={handleActivateCampaign}
                >
                  <Icon name="check" size={20} color="#FFF" />
                  <Text style={styles.activateButtonText}>Kampanyayı Aktifleştir</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backButton: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  headerTitle: { ...TextStyles.h3 },
  headerSpacer: { width: 44 },
  categoriesContainer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  categoryChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 6, height: 28 },
  categoryText: { fontSize: 11, marginLeft: 4 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing["2xl"] },
  summaryCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { ...TextStyles.labelMedium, color: "rgba(255,255,255,0.8)" },
  summaryAmount: { fontSize: 28, fontWeight: "700", color: "#FFF", marginTop: 4 },
  summaryIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  summaryStats: { flexDirection: "row", marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.2)", alignItems: "center" },
  summaryStatItem: { flex: 1, alignItems: "center" },
  summaryStatValue: { ...TextStyles.labelLarge, color: "#FFF", fontWeight: "700" },
  summaryStatLabel: { ...TextStyles.caption, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.2)" },
  sectionTitle: { ...TextStyles.labelLarge, marginBottom: Spacing.md },
  campaignCard: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, ...Shadows.sm },
  campaignBadge: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  campaignContent: { flex: 1, marginLeft: Spacing.sm, marginRight: Spacing.xs },
  campaignTitle: { ...TextStyles.labelMedium },
  campaignDesc: { ...TextStyles.caption, marginTop: 2 },
  campaignMeta: { flexDirection: "row", alignItems: "center", marginTop: Spacing.xs, gap: Spacing.sm },
  cashbackBadge: { paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: BorderRadius.sm },
  cashbackText: { ...TextStyles.caption, fontWeight: "600" },
  validText: { ...TextStyles.caption },
  emptyState: { alignItems: "center", paddingVertical: Spacing.xl },
  emptyText: { ...TextStyles.bodyMedium, marginTop: Spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, padding: Spacing.lg, paddingBottom: Spacing["2xl"] },
  modalHeader: { alignItems: "center", marginBottom: Spacing.md },
  modalBadge: { width: 72, height: 72, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  closeButton: { position: "absolute", top: 0, right: 0, padding: Spacing.xs },
  modalTitle: { ...TextStyles.h3, textAlign: "center", marginBottom: Spacing.xs },
  modalDesc: { ...TextStyles.bodyMedium, textAlign: "center", marginBottom: Spacing.lg },
  modalStats: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.md },
  modalStatCard: { flex: 1, alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg },
  modalStatValue: { fontSize: 24, fontWeight: "700" },
  modalStatLabel: { ...TextStyles.caption, marginTop: Spacing.xxs },
  termsBox: { flexDirection: "row", alignItems: "flex-start", padding: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.sm, marginBottom: Spacing.md },
  termsText: { ...TextStyles.caption, flex: 1 },
  validUntil: { ...TextStyles.caption, textAlign: "center", marginBottom: Spacing.lg },
  activateButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 52, borderRadius: BorderRadius.lg, gap: Spacing.xs },
  activateButtonText: { ...TextStyles.labelLarge, color: "#FFF" },
});

export default CampaignsScreen;
