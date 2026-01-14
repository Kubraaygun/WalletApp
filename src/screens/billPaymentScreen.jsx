import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const BILL_TYPES = [
  { id: "electric", name: "Elektrik", icon: "zap", color: "#F59E0B", company: "EDAŞ" },
  { id: "water", name: "Su", icon: "droplet", color: "#3B82F6", company: "İSKİ" },
  { id: "gas", name: "Doğalgaz", icon: "thermometer", color: "#EF4444", company: "İGDAŞ" },
  { id: "internet", name: "İnternet", icon: "wifi", color: "#8B5CF6", company: "Türk Telekom" },
  { id: "phone", name: "Telefon", icon: "phone", color: "#10B981", company: "Vodafone" },
  { id: "tv", name: "TV/Dijital", icon: "tv", color: "#EC4899", company: "Digiturk" },
];

const RECENT_BILLS = [
  { id: "1", type: "electric", company: "EDAŞ", amount: 245.50, dueDate: "15 Ocak 2026", paid: false },
  { id: "2", type: "water", company: "İSKİ", amount: 89.00, dueDate: "20 Ocak 2026", paid: false },
  { id: "3", type: "gas", company: "İGDAŞ", amount: 320.75, dueDate: "18 Ocak 2026", paid: true },
  { id: "4", type: "internet", company: "Türk Telekom", amount: 189.00, dueDate: "25 Ocak 2026", paid: false },
];

const BillPaymentScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [selectedBill, setSelectedBill] = useState(null);
  const [subscriberNo, setSubscriberNo] = useState("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [queryModalVisible, setQueryModalVisible] = useState(false);
  const [bills, setBills] = useState(RECENT_BILLS);

  const handleBack = () => navigation.goBack();

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getBillTypeInfo = (typeId) => {
    return BILL_TYPES.find((t) => t.id === typeId) || BILL_TYPES[0];
  };

  const handleBillTypePress = (billType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBill(billType);
    setSubscriberNo("");
    setQueryModalVisible(true);
  };

  const handleQueryBill = () => {
    if (!subscriberNo || subscriberNo.length < 5) {
      Alert.alert("Hata", "Geçerli bir abone numarası girin");
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setQueryModalVisible(false);
    
    // Simulate bill query
    setTimeout(() => {
      Alert.alert(
        "Fatura Bulundu",
        `${selectedBill.company} - ${selectedBill.name}\nTutar: ₺${formatAmount(Math.random() * 300 + 50)}\nSon Ödeme: 25 Ocak 2026`,
        [
          { text: "İptal", style: "cancel" },
          { text: "Öde", onPress: () => handlePayBill(selectedBill, Math.random() * 300 + 50) }
        ]
      );
    }, 1000);
  };

  const handlePayBill = (bill, amount) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      "Ödeme Onayı",
      `₺${formatAmount(amount)} tutarındaki faturayı ödemek istiyor musunuz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Onayla",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Mark as paid
            setBills(bills.map(b => b.id === bill.id ? { ...b, paid: true } : b));
            Alert.alert("Başarılı", "Fatura ödemesi başarıyla tamamlandı!");
          }
        }
      ]
    );
  };

  const handleRecentBillPress = (bill) => {
    if (bill.paid) {
      Alert.alert("Bilgi", "Bu fatura zaten ödenmiş");
      return;
    }
    handlePayBill(bill, bill.amount);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Fatura Ödeme</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bill Types Grid */}
        <FadeSlide delay={0}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Fatura Türü Seçin</Text>
          <View style={styles.billGrid}>
            {BILL_TYPES.map((billType, index) => (
              <TouchableOpacity
                key={billType.id}
                style={[styles.billTypeCard, { backgroundColor: colors.SURFACE }]}
                onPress={() => handleBillTypePress(billType)}
                activeOpacity={0.7}
              >
                <View style={[styles.billTypeIcon, { backgroundColor: `${billType.color}15` }]}>
                  <Icon name={billType.icon} size={24} color={billType.color} />
                </View>
                <Text style={[styles.billTypeName, { color: colors.TEXT_PRIMARY }]}>{billType.name}</Text>
                <Text style={[styles.billTypeCompany, { color: colors.TEXT_SECONDARY }]}>{billType.company}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </FadeSlide>

        {/* Recent Bills */}
        <FadeSlide delay={100}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY, marginTop: Spacing.lg }]}>Bekleyen Faturalar</Text>
          {bills.filter(b => !b.paid).length > 0 ? (
            bills.filter(b => !b.paid).map((bill) => {
              const typeInfo = getBillTypeInfo(bill.type);
              return (
                <TouchableOpacity
                  key={bill.id}
                  style={[styles.billCard, { backgroundColor: colors.SURFACE }]}
                  onPress={() => handleRecentBillPress(bill)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.billIcon, { backgroundColor: `${typeInfo.color}15` }]}>
                    <Icon name={typeInfo.icon} size={20} color={typeInfo.color} />
                  </View>
                  <View style={styles.billInfo}>
                    <Text style={[styles.billCompany, { color: colors.TEXT_PRIMARY }]}>{bill.company}</Text>
                    <Text style={[styles.billDue, { color: colors.TEXT_SECONDARY }]}>Son Ödeme: {bill.dueDate}</Text>
                  </View>
                  <View style={styles.billAmountContainer}>
                    <Text style={[styles.billAmount, { color: colors.ERROR }]}>₺{formatAmount(bill.amount)}</Text>
                    <Icon name="chevron-right" size={16} color={colors.GRAY_400} />
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.SURFACE }]}>
              <Icon name="check-circle" size={48} color={colors.SUCCESS} />
              <Text style={[styles.emptyText, { color: colors.TEXT_PRIMARY }]}>Tüm faturalar ödendi!</Text>
            </View>
          )}
        </FadeSlide>

        {/* Paid Bills */}
        <FadeSlide delay={200}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY, marginTop: Spacing.lg }]}>Ödenen Faturalar</Text>
          {bills.filter(b => b.paid).map((bill) => {
            const typeInfo = getBillTypeInfo(bill.type);
            return (
              <View
                key={bill.id}
                style={[styles.billCard, styles.paidBillCard, { backgroundColor: colors.SURFACE }]}
              >
                <View style={[styles.billIcon, { backgroundColor: `${colors.SUCCESS}15` }]}>
                  <Icon name="check" size={20} color={colors.SUCCESS} />
                </View>
                <View style={styles.billInfo}>
                  <Text style={[styles.billCompany, { color: colors.TEXT_SECONDARY }]}>{bill.company}</Text>
                  <Text style={[styles.billDue, { color: colors.GRAY_400 }]}>Ödendi</Text>
                </View>
                <Text style={[styles.billAmount, { color: colors.SUCCESS }]}>₺{formatAmount(bill.amount)}</Text>
              </View>
            );
          })}
        </FadeSlide>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: `${colors.INFO}10` }]}>
          <Icon name="info" size={16} color={colors.INFO} />
          <Text style={[styles.infoText, { color: colors.INFO }]}>
            Otomatik ödeme talimatı vermek için fatura türüne uzun basın
          </Text>
        </View>
      </ScrollView>

      {/* Query Modal */}
      <Modal visible={queryModalVisible} animationType="slide" transparent onRequestClose={() => setQueryModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.BACKGROUND }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>
                {selectedBill?.name} Fatura Sorgula
              </Text>
              <TouchableOpacity onPress={() => setQueryModalVisible(false)}>
                <Icon name="x" size={24} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {selectedBill && (
              <View style={[styles.selectedBillInfo, { backgroundColor: `${selectedBill.color}10` }]}>
                <Icon name={selectedBill.icon} size={24} color={selectedBill.color} />
                <Text style={[styles.selectedBillText, { color: selectedBill.color }]}>{selectedBill.company}</Text>
              </View>
            )}

            <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>Abone Numarası</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
              value={subscriberNo}
              onChangeText={setSubscriberNo}
              placeholder="Abone numaranızı girin"
              placeholderTextColor={colors.GRAY_400}
              keyboardType="number-pad"
              maxLength={15}
            />

            <TouchableOpacity
              style={[styles.queryButton, { backgroundColor: colors.PRIMARY }]}
              onPress={handleQueryBill}
            >
              <Icon name="search" size={20} color="#FFF" />
              <Text style={styles.queryButtonText}>Fatura Sorgula</Text>
            </TouchableOpacity>
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
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing["2xl"] },
  sectionTitle: { ...TextStyles.labelLarge, marginBottom: Spacing.md },
  billGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  billTypeCard: { width: "31%", padding: Spacing.md, borderRadius: BorderRadius.lg, alignItems: "center", ...Shadows.sm },
  billTypeIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: Spacing.xs },
  billTypeName: { ...TextStyles.labelMedium, textAlign: "center" },
  billTypeCompany: { ...TextStyles.caption, textAlign: "center" },
  billCard: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, ...Shadows.sm },
  paidBillCard: { opacity: 0.7 },
  billIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  billInfo: { flex: 1, marginLeft: Spacing.sm },
  billCompany: { ...TextStyles.labelMedium },
  billDue: { ...TextStyles.caption, marginTop: 2 },
  billAmountContainer: { flexDirection: "row", alignItems: "center", gap: Spacing.xs },
  billAmount: { ...TextStyles.labelLarge, fontWeight: "700" },
  emptyState: { alignItems: "center", padding: Spacing.xl, borderRadius: BorderRadius.lg },
  emptyText: { ...TextStyles.bodyMedium, marginTop: Spacing.sm },
  infoBox: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.sm, marginTop: Spacing.lg },
  infoText: { ...TextStyles.caption, flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, padding: Spacing.lg, paddingBottom: Spacing["2xl"] },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.lg },
  modalTitle: { ...TextStyles.h3 },
  selectedBillInfo: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, gap: Spacing.sm },
  selectedBillText: { ...TextStyles.labelMedium, fontWeight: "600" },
  inputLabel: { ...TextStyles.labelSmall, marginBottom: Spacing.xs },
  input: { height: 56, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, borderWidth: 1, ...TextStyles.bodyLarge },
  queryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 52, borderRadius: BorderRadius.lg, marginTop: Spacing.lg, gap: Spacing.xs },
  queryButtonText: { ...TextStyles.labelLarge, color: "#FFF" },
});

export default BillPaymentScreen;
