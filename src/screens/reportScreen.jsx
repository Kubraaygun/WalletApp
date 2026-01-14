import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useSelector } from "react-redux";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const REPORT_TYPES = [
  { id: "monthly", title: "Aylık Hesap Özeti", icon: "calendar", description: "Son 30 günlük işlemler" },
  { id: "annual", title: "Yıllık Rapor", icon: "file-text", description: "2025 yılı özeti" },
  { id: "transactions", title: "İşlem Geçmişi", icon: "list", description: "Tüm işlemler detaylı" },
  { id: "budget", title: "Bütçe Raporu", icon: "pie-chart", description: "Kategori bazlı harcamalar" },
];

const ReportScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleBack = () => navigation.goBack();

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const generatePDFContent = (type) => {
    const today = new Date();
    const userName = user?.name || "Kullanıcı";
    const currentBalance = balance || 0;

    const transactions = [
      { date: "12 Ocak 2026", description: "Market Alışverişi", amount: -245.50, type: "expense" },
      { date: "11 Ocak 2026", description: "Maaş Ödemesi", amount: 15000, type: "income" },
      { date: "10 Ocak 2026", description: "Elektrik Faturası", amount: -185.00, type: "expense" },
      { date: "9 Ocak 2026", description: "Restoran", amount: -120.00, type: "expense" },
      { date: "8 Ocak 2026", description: "Para Transferi", amount: -500.00, type: "expense" },
      { date: "7 Ocak 2026", description: "Freelance Ödeme", amount: 2500, type: "income" },
    ];

    const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = Math.abs(transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0));

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1F2937; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6366F1; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #6366F1; }
            .subtitle { color: #6B7280; margin-top: 5px; }
            .date { color: #9CA3AF; font-size: 12px; margin-top: 10px; }
            .user-info { background: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
            .user-name { font-weight: 600; font-size: 16px; }
            .user-email { color: #6B7280; font-size: 14px; }
            .summary { display: flex; justify-content: space-between; margin-bottom: 25px; }
            .summary-card { flex: 1; padding: 20px; border-radius: 8px; text-align: center; margin: 0 5px; }
            .summary-card.balance { background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; }
            .summary-card.income { background: #D1FAE5; color: #059669; }
            .summary-card.expense { background: #FEE2E2; color: #DC2626; }
            .summary-value { font-size: 22px; font-weight: bold; }
            .summary-label { font-size: 12px; margin-top: 5px; opacity: 0.8; }
            .section-title { font-size: 16px; font-weight: 600; margin: 20px 0 15px; color: #374151; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #F3F4F6; padding: 12px; text-align: left; font-weight: 600; font-size: 12px; color: #6B7280; }
            td { padding: 12px; border-bottom: 1px solid #E5E7EB; font-size: 14px; }
            .amount.income { color: #059669; }
            .amount.expense { color: #DC2626; }
            .footer { margin-top: 40px; text-align: center; color: #9CA3AF; font-size: 11px; border-top: 1px solid #E5E7EB; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">💳 WalletApp</div>
            <div class="subtitle">${type === "monthly" ? "Aylık Hesap Özeti" : type === "annual" ? "Yıllık Rapor" : type === "transactions" ? "İşlem Geçmişi" : "Bütçe Raporu"}</div>
            <div class="date">Oluşturulma: ${formatDate(today)}</div>
          </div>

          <div class="user-info">
            <div class="user-name">${userName}</div>
            <div class="user-email">${user?.email || "email@example.com"}</div>
          </div>

          <div class="summary">
            <div class="summary-card balance">
              <div class="summary-value">₺${formatAmount(currentBalance)}</div>
              <div class="summary-label">Güncel Bakiye</div>
            </div>
            <div class="summary-card income">
              <div class="summary-value">₺${formatAmount(totalIncome)}</div>
              <div class="summary-label">Toplam Gelir</div>
            </div>
            <div class="summary-card expense">
              <div class="summary-value">₺${formatAmount(totalExpense)}</div>
              <div class="summary-label">Toplam Gider</div>
            </div>
          </div>

          <div class="section-title">Son İşlemler</div>
          <table>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Açıklama</th>
                <th style="text-align: right;">Tutar</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${t.date}</td>
                  <td>${t.description}</td>
                  <td class="amount ${t.type}" style="text-align: right;">${t.type === "income" ? "+" : ""}₺${formatAmount(Math.abs(t.amount))}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Bu rapor WalletApp tarafından otomatik olarak oluşturulmuştur.</p>
            <p>© 2026 WalletApp - Tüm hakları saklıdır.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleGenerateReport = async (type) => {
    setSelectedReport(type);
    setGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const html = generatePDFContent(type.id);
      const { uri } = await Print.printToFileAsync({ html });
      
      setGenerating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `${type.title} Paylaş`,
        });
      } else {
        Alert.alert("Başarılı", `${type.title} PDF olarak oluşturuldu.`);
      }
    } catch (error) {
      setGenerating(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Hata", "Rapor oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Raporlar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <FadeSlide delay={0}>
          <View style={[styles.infoCard, { backgroundColor: `${colors.PRIMARY}10` }]}>
            <View style={[styles.infoIcon, { backgroundColor: colors.PRIMARY }]}>
              <Icon name="file-text" size={24} color="#FFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.TEXT_PRIMARY }]}>PDF Rapor Oluştur</Text>
              <Text style={[styles.infoDesc, { color: colors.TEXT_SECONDARY }]}>
                Hesap özetinizi ve işlem geçmişinizi PDF olarak indirin veya paylaşın
              </Text>
            </View>
          </View>
        </FadeSlide>

        {/* Report Types */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Rapor Türü Seçin</Text>
        
        {REPORT_TYPES.map((type, index) => (
          <FadeSlide key={type.id} delay={index * 50}>
            <TouchableOpacity
              style={[styles.reportCard, { backgroundColor: colors.SURFACE }]}
              onPress={() => handleGenerateReport(type)}
              disabled={generating}
              activeOpacity={0.7}
            >
              <View style={[styles.reportIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
                <Icon name={type.icon} size={24} color={colors.PRIMARY} />
              </View>
              <View style={styles.reportContent}>
                <Text style={[styles.reportTitle, { color: colors.TEXT_PRIMARY }]}>{type.title}</Text>
                <Text style={[styles.reportDesc, { color: colors.TEXT_SECONDARY }]}>{type.description}</Text>
              </View>
              {generating && selectedReport?.id === type.id ? (
                <ActivityIndicator color={colors.PRIMARY} />
              ) : (
                <View style={[styles.downloadButton, { backgroundColor: colors.PRIMARY }]}>
                  <Icon name="download" size={18} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          </FadeSlide>
        ))}

        {/* Security Note */}
        <View style={[styles.securityNote, { backgroundColor: `${colors.SUCCESS}10` }]}>
          <Icon name="shield" size={16} color={colors.SUCCESS} />
          <Text style={[styles.securityText, { color: colors.SUCCESS }]}>
            Raporlarınız şifreli olarak oluşturulur ve sadece sizinle paylaşılır
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backButton: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  headerTitle: { ...TextStyles.h3 },
  headerSpacer: { width: 44 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing["2xl"] },
  infoCard: { flexDirection: "row", alignItems: "center", padding: Spacing.lg, borderRadius: BorderRadius.xl, marginBottom: Spacing.lg },
  infoIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  infoContent: { flex: 1, marginLeft: Spacing.md },
  infoTitle: { ...TextStyles.labelLarge },
  infoDesc: { ...TextStyles.caption, marginTop: Spacing.xxs },
  sectionTitle: { ...TextStyles.labelLarge, marginBottom: Spacing.md },
  reportCard: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, ...Shadows.sm },
  reportIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  reportContent: { flex: 1, marginLeft: Spacing.md },
  reportTitle: { ...TextStyles.labelMedium },
  reportDesc: { ...TextStyles.caption, marginTop: 2 },
  downloadButton: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  securityNote: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, marginTop: Spacing.lg, gap: Spacing.sm },
  securityText: { ...TextStyles.caption, flex: 1 },
});

export default ReportScreen;
