import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - Spacing.md * 2;

// Card type configurations
const CARD_TYPES = [
  {
    id: "shopping",
    name: "Alışveriş Kartı",
    icon: "shopping-bag",
    description: "Günlük alışverişler için ideal",
    gradient: ["#F43F5E", "#FB7185"],
    defaultName: "Alışveriş Kartı",
  },
  {
    id: "savings",
    name: "Tasarruf Kartı",
    icon: "dollar-sign",
    description: "Birikim yapmak için uygun",
    gradient: ["#059669", "#34D399"],
    defaultName: "Tasarruf Kartı",
  },
  {
    id: "travel",
    name: "Seyahat Kartı",
    icon: "map-pin",
    description: "Yurt dışı harcamalar için",
    gradient: ["#0066FF", "#00D4FF"],
    defaultName: "Seyahat Kartı",
  },
  {
    id: "general",
    name: "Genel Kart",
    icon: "credit-card",
    description: "Her amaç için kullanılabilir",
    gradient: ["#1F2937", "#4B5563"],
    defaultName: "Genel Kart",
  },
];

const MOCK_CARDS = [
  { id: "1", type: "general", name: "Ana Kart", number: "4582", expiry: "12/28", balance: 15420.5, gradient: ["#667EEA", "#764BA2"], isActive: true, createdAt: "01.01.2024" },
  { id: "2", type: "shopping", name: "Alışveriş Kartı", number: "7891", expiry: "06/27", balance: 2500.0, gradient: ["#F43F5E", "#FB7185"], isActive: true, createdAt: "15.03.2024" },
  { id: "3", type: "savings", name: "Tasarruf Kartı", number: "3456", expiry: "03/29", balance: 8750.0, gradient: ["#059669", "#34D399"], isActive: false, createdAt: "20.06.2024" },
];

const CardItem = ({ card, index, onPress, onInfoPress }) => {
  const formatBalance = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <FadeSlide delay={index * 150}>
      <TouchableOpacity onPress={() => onPress(card)} activeOpacity={0.9}>
        <LinearGradient
          colors={card.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cardContainer, !card.isActive && styles.cardInactive]}
        >
          {/* Info Button - Top Right Corner */}
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={(e) => {
              e.stopPropagation();
              onInfoPress(card);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="eye" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{card.name}</Text>
            <Text style={styles.cardType}>Sanal Kart</Text>
          </View>

          <View style={styles.cardNumberRow}>
            <Text style={styles.cardDots}>•••• •••• ••••</Text>
            <Text style={styles.cardLastDigits}>{card.number}</Text>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>Bakiye</Text>
              <Text style={styles.cardBalance}>₺{formatBalance(card.balance)}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Son Kullanma</Text>
              <Text style={styles.cardExpiry}>{card.expiry}</Text>
            </View>
          </View>

          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </LinearGradient>
      </TouchableOpacity>
    </FadeSlide>
  );
};

// Card Type Selection Item
const CardTypeItem = ({ type, isSelected, onSelect, colors }) => (
  <TouchableOpacity
    style={[
      styles.cardTypeItem,
      { 
        backgroundColor: isSelected ? `${colors.PRIMARY}15` : colors.SURFACE,
        borderColor: isSelected ? colors.PRIMARY : colors.BORDER,
      }
    ]}
    onPress={() => onSelect(type)}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={type.gradient}
      style={styles.cardTypeIcon}
    >
      <Icon name={type.icon} size={20} color="#FFFFFF" />
    </LinearGradient>
    <View style={styles.cardTypeContent}>
      <Text style={[styles.cardTypeName, { color: colors.TEXT_PRIMARY }]}>
        {type.name}
      </Text>
      <Text style={[styles.cardTypeDesc, { color: colors.TEXT_SECONDARY }]}>
        {type.description}
      </Text>
    </View>
    {isSelected && (
      <View style={[styles.checkIcon, { backgroundColor: colors.PRIMARY }]}>
        <Icon name="check" size={14} color="#FFFFFF" />
      </View>
    )}
  </TouchableOpacity>
);

const CardsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [cards, setCards] = useState(MOCK_CARDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [cardName, setCardName] = useState("");
  const [step, setStep] = useState(1);

  const formatBalance = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleCardPress = (card) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCard(card);
    setShowDetailModal(true);
  };

  const handleInfoPress = (card) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCard(card);
    setShowDetailModal(true);
  };

  const handleToggleCard = () => {
    if (selectedCard) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCards(cards.map((card) => 
        card.id === selectedCard.id ? { ...card, isActive: !card.isActive } : card
      ));
      setSelectedCard({ ...selectedCard, isActive: !selectedCard.isActive });
    }
  };

  const handleDeleteCard = () => {
    if (!selectedCard) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Kartı Sil",
      `"${selectedCard.name}" kartını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCards(cards.filter(card => card.id !== selectedCard.id));
            setShowDetailModal(false);
            setSelectedCard(null);
          }
        }
      ]
    );
  };

  const handleAddCard = () => {
    setShowAddModal(true);
    setStep(1);
    setSelectedType(null);
    setCardName("");
  };

  const handleSelectType = (type) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(type);
    setCardName(type.defaultName);
  };

  const handleContinue = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2 && cardName.trim()) {
      handleCreateCard();
    }
  };

  const handleCreateCard = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const now = new Date();
    const newCard = {
      id: String(Date.now()),
      type: selectedType.id,
      name: cardName.trim(),
      number: String(Math.floor(1000 + Math.random() * 9000)),
      expiry: "01/30",
      balance: 0,
      gradient: selectedType.gradient,
      isActive: true,
      createdAt: `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`,
    };
    setCards([...cards, newCard]);
    setShowAddModal(false);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setStep(1);
    setSelectedType(null);
    setCardName("");
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      handleCloseModal();
    }
  };

  const totalBalance = cards.filter((c) => c.isActive).reduce((sum, card) => sum + card.balance, 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />

      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Kartlarım</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: `${colors.PRIMARY}15` }]} onPress={handleAddCard}>
          <Icon name="plus" size={IconSize.md} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeSlide delay={0}>
          <View style={[styles.totalCard, { backgroundColor: colors.SURFACE }]}>
            <Text style={[styles.totalLabel, { color: colors.TEXT_SECONDARY }]}>Toplam Bakiye</Text>
            <Text style={[styles.totalAmount, { color: colors.TEXT_PRIMARY }]}>
              ₺{totalBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.totalInfo, { color: colors.TEXT_SECONDARY }]}>{cards.filter((c) => c.isActive).length} aktif kart</Text>
          </View>
        </FadeSlide>

        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Sanal Kartlar</Text>
        {cards.map((card, index) => (
          <CardItem 
            key={card.id} 
            card={card} 
            index={index} 
            onPress={handleCardPress} 
            onInfoPress={handleInfoPress} 
          />
        ))}

        <FadeSlide delay={cards.length * 150 + 100}>
          <TouchableOpacity style={[styles.addCardButton, { backgroundColor: `${colors.PRIMARY}10`, borderColor: colors.PRIMARY }]} onPress={handleAddCard}>
            <Icon name="plus-circle" size={24} color={colors.PRIMARY} />
            <Text style={[styles.addCardText, { color: colors.PRIMARY }]}>Yeni Kart Ekle</Text>
          </TouchableOpacity>
        </FadeSlide>
      </ScrollView>

      {/* Card Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.SURFACE }]}>
            {/* Modal Handle */}
            <View style={styles.modalHandle}>
              <View style={[styles.handleBar, { backgroundColor: colors.GRAY_300 }]} />
            </View>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDetailModal(false)} style={styles.backButton}>
                <Icon name="x" size={24} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>Kart Detayı</Text>
              <View style={styles.headerSpacer} />
            </View>

            {selectedCard && (
              <>
                {/* Card Preview */}
                <LinearGradient
                  colors={selectedCard.gradient}
                  style={styles.detailCardPreview}
                >
                  <Text style={styles.detailCardName}>{selectedCard.name}</Text>
                  <Text style={styles.detailCardNumber}>•••• •••• •••• {selectedCard.number}</Text>
                  <View style={styles.detailCardFooter}>
                    <Text style={styles.detailCardBalance}>₺{formatBalance(selectedCard.balance)}</Text>
                    <Text style={styles.detailCardExpiry}>{selectedCard.expiry}</Text>
                  </View>
                </LinearGradient>

                {/* Card Info */}
                <View style={styles.detailInfo}>
                  <DetailRow 
                    icon="credit-card" 
                    label="Kart Numarası" 
                    value={`•••• •••• •••• ${selectedCard.number}`}
                    colors={colors}
                  />
                  <DetailRow 
                    icon="calendar" 
                    label="Son Kullanma Tarihi" 
                    value={selectedCard.expiry}
                    colors={colors}
                  />
                  <DetailRow 
                    icon="clock" 
                    label="Oluşturma Tarihi" 
                    value={selectedCard.createdAt || "01.01.2024"}
                    colors={colors}
                  />
                  <DetailRow 
                    icon="check-circle" 
                    label="Durum" 
                    value={selectedCard.isActive ? "Aktif" : "Pasif"}
                    valueColor={selectedCard.isActive ? "#4ADE80" : colors.ERROR}
                    colors={colors}
                  />
                </View>

                {/* Action Buttons */}
                <View style={styles.detailActions}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: colors.BACKGROUND }]}
                    onPress={handleToggleCard}
                  >
                    <Icon 
                      name={selectedCard.isActive ? "pause-circle" : "play-circle"} 
                      size={20} 
                      color={colors.TEXT_PRIMARY} 
                    />
                    <Text style={[styles.actionBtnText, { color: colors.TEXT_PRIMARY }]}>
                      {selectedCard.isActive ? "Dondur" : "Aktifleştir"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: `${colors.ERROR}15` }]}
                    onPress={handleDeleteCard}
                  >
                    <Icon name="trash-2" size={20} color={colors.ERROR} />
                    <Text style={[styles.actionBtnText, { color: colors.ERROR }]}>Kartı Sil</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Card Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.SURFACE }]}>
            {/* Modal Handle */}
            <View style={styles.modalHandle}>
              <View style={[styles.handleBar, { backgroundColor: colors.GRAY_300 }]} />
            </View>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Icon name={step === 1 ? "x" : "arrow-left"} size={24} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>
                {step === 1 ? "Kart Tipi Seçin" : "Kart Adı"}
              </Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, { backgroundColor: colors.PRIMARY }]} />
              <View style={[styles.stepLine, { backgroundColor: step === 2 ? colors.PRIMARY : colors.GRAY_300 }]} />
              <View style={[styles.stepDot, { backgroundColor: step === 2 ? colors.PRIMARY : colors.GRAY_300 }]} />
            </View>

            {/* Step 1: Card Type Selection */}
            {step === 1 && (
              <ScrollView style={styles.typeList} showsVerticalScrollIndicator={false}>
                {CARD_TYPES.map((type) => (
                  <CardTypeItem
                    key={type.id}
                    type={type}
                    isSelected={selectedType?.id === type.id}
                    onSelect={handleSelectType}
                    colors={colors}
                  />
                ))}
              </ScrollView>
            )}

            {/* Step 2: Card Name Input */}
            {step === 2 && (
              <View style={styles.nameInputContainer}>
                <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>
                  Kart Adını Girin
                </Text>
                <TextInput
                  style={[
                    styles.nameInput,
                    { 
                      backgroundColor: colors.BACKGROUND,
                      color: colors.TEXT_PRIMARY,
                      borderColor: colors.BORDER,
                    }
                  ]}
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="Örn: Alışveriş Kartım"
                  placeholderTextColor={colors.GRAY_400}
                  autoFocus
                />
                
                {/* Preview Card */}
                {selectedType && (
                  <View style={styles.previewContainer}>
                    <Text style={[styles.previewLabel, { color: colors.TEXT_SECONDARY }]}>
                      Önizleme
                    </Text>
                    <LinearGradient
                      colors={selectedType.gradient}
                      style={styles.previewCard}
                    >
                      <Text style={styles.previewCardName}>{cardName || selectedType.defaultName}</Text>
                      <Text style={styles.previewCardNumber}>•••• •••• •••• ****</Text>
                    </LinearGradient>
                  </View>
                )}
              </View>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                { 
                  backgroundColor: (step === 1 && selectedType) || (step === 2 && cardName.trim()) 
                    ? colors.PRIMARY 
                    : colors.GRAY_300 
                }
              ]}
              onPress={handleContinue}
              disabled={step === 1 ? !selectedType : !cardName.trim()}
            >
              <Text style={styles.continueButtonText}>
                {step === 1 ? "Devam Et" : "Kartı Oluştur"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Detail Row Component
const DetailRow = ({ icon, label, value, valueColor, colors }) => (
  <View style={[styles.detailRow, { borderBottomColor: colors.BORDER }]}>
    <View style={[styles.detailRowIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
      <Icon name={icon} size={16} color={colors.PRIMARY} />
    </View>
    <View style={styles.detailRowContent}>
      <Text style={[styles.detailRowLabel, { color: colors.TEXT_SECONDARY }]}>{label}</Text>
      <Text style={[styles.detailRowValue, { color: valueColor || colors.TEXT_PRIMARY }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  headerTitle: { ...TextStyles.h3 },
  addButton: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  headerSpacer: { width: 44 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing["2xl"] },
  totalCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg, alignItems: "center" },
  totalLabel: { ...TextStyles.labelMedium },
  totalAmount: { ...TextStyles.displayLarge, marginVertical: Spacing.xs },
  totalInfo: { ...TextStyles.caption },
  sectionTitle: { ...TextStyles.h4, marginBottom: Spacing.md },
  cardContainer: { width: CARD_WIDTH, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, overflow: "hidden", ...Shadows.lg },
  cardInactive: { opacity: 0.6 },
  cardHeader: { marginBottom: Spacing.lg },
  cardName: { ...TextStyles.labelLarge, color: "#FFFFFF" },
  cardType: { ...TextStyles.caption, color: "rgba(255,255,255,0.7)" },
  infoButton: { position: "absolute", top: Spacing.md, right: Spacing.md, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", zIndex: 10 },
  cardNumberRow: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.lg },
  cardDots: { ...TextStyles.h4, color: "rgba(255,255,255,0.7)", letterSpacing: 2 },
  cardLastDigits: { ...TextStyles.h4, color: "#FFFFFF", marginLeft: Spacing.xs },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  cardLabel: { ...TextStyles.caption, color: "rgba(255,255,255,0.7)", marginBottom: 2 },
  cardBalance: { ...TextStyles.labelLarge, color: "#FFFFFF" },
  cardExpiry: { ...TextStyles.labelMedium, color: "#FFFFFF" },
  decorCircle1: { position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.1)" },
  decorCircle2: { position: "absolute", bottom: -40, left: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.05)" },
  addCardButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: BorderRadius.lg, borderWidth: 2, borderStyle: "dashed", padding: Spacing.lg, marginTop: Spacing.sm },
  addCardText: { ...TextStyles.labelLarge, marginLeft: Spacing.sm },
  
  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: BorderRadius["2xl"], borderTopRightRadius: BorderRadius["2xl"], paddingBottom: Spacing["2xl"], maxHeight: "90%" },
  modalHandle: { alignItems: "center", paddingVertical: Spacing.sm },
  handleBar: { width: 40, height: 4, borderRadius: 2 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  modalTitle: { ...TextStyles.h3 },
  backButton: { padding: Spacing.xs },
  stepIndicator: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: Spacing.lg },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { width: 40, height: 2, marginHorizontal: Spacing.xs },
  
  // Type Selection
  typeList: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  cardTypeItem: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 2, marginBottom: Spacing.sm },
  cardTypeIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  cardTypeContent: { flex: 1, marginLeft: Spacing.md },
  cardTypeName: { ...TextStyles.labelLarge, marginBottom: 2 },
  cardTypeDesc: { ...TextStyles.caption },
  checkIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  
  // Name Input
  nameInputContainer: { paddingHorizontal: Spacing.md, flex: 1 },
  inputLabel: { ...TextStyles.labelMedium, marginBottom: Spacing.xs },
  nameInput: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md, ...TextStyles.bodyLarge, marginBottom: Spacing.lg },
  previewContainer: { marginTop: Spacing.md },
  previewLabel: { ...TextStyles.labelMedium, marginBottom: Spacing.sm },
  previewCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, height: 100 },
  previewCardName: { ...TextStyles.labelLarge, color: "#FFFFFF" },
  previewCardNumber: { ...TextStyles.bodySmall, color: "rgba(255,255,255,0.7)", marginTop: Spacing.sm },
  
  // Continue Button
  continueButton: { marginHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: "center" },
  continueButtonText: { ...TextStyles.labelLarge, color: "#FFFFFF" },
  
  // Detail Modal
  detailCardPreview: { marginHorizontal: Spacing.md, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
  detailCardName: { ...TextStyles.h4, color: "#FFFFFF", marginBottom: Spacing.xs },
  detailCardNumber: { ...TextStyles.bodyMedium, color: "rgba(255,255,255,0.8)", marginBottom: Spacing.md },
  detailCardFooter: { flexDirection: "row", justifyContent: "space-between" },
  detailCardBalance: { ...TextStyles.h3, color: "#FFFFFF" },
  detailCardExpiry: { ...TextStyles.labelMedium, color: "rgba(255,255,255,0.7)" },
  detailInfo: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  detailRow: { flexDirection: "row", alignItems: "center", paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  detailRowIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: Spacing.sm },
  detailRowContent: { flex: 1 },
  detailRowLabel: { ...TextStyles.caption, marginBottom: 2 },
  detailRowValue: { ...TextStyles.bodyMedium, fontWeight: "500" },
  detailActions: { flexDirection: "row", paddingHorizontal: Spacing.md, gap: Spacing.sm },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.xs },
  actionBtnText: { ...TextStyles.labelMedium },
});

export default CardsScreen;
