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
    gradient: ["#FF6B6B", "#EE5A5A"],
    defaultName: "Alışveriş Kartı",
  },
  {
    id: "savings",
    name: "Tasarruf Kartı",
    icon: "piggy-bank",
    description: "Birikim yapmak için uygun",
    gradient: ["#34C759", "#30D158"],
    defaultName: "Tasarruf Kartı",
  },
  {
    id: "travel",
    name: "Seyahat Kartı",
    icon: "map-pin",
    description: "Yurt dışı harcamalar için",
    gradient: ["#007AFF", "#5856D6"],
    defaultName: "Seyahat Kartı",
  },
  {
    id: "general",
    name: "Genel Kart",
    icon: "credit-card",
    description: "Her amaç için kullanılabilir",
    gradient: ["#1C1C1E", "#3A3A3C"],
    defaultName: "Genel Kart",
  },
];

const MOCK_CARDS = [
  { id: "1", type: "general", name: "Ana Kart", number: "4582", expiry: "12/28", balance: 15420.5, gradient: ["#007AFF", "#5856D6"], isActive: true },
  { id: "2", type: "shopping", name: "Alışveriş Kartı", number: "7891", expiry: "06/27", balance: 2500.0, gradient: ["#FF6B6B", "#EE5A5A"], isActive: true },
  { id: "3", type: "savings", name: "Tasarruf Kartı", number: "3456", expiry: "03/29", balance: 8750.0, gradient: ["#34C759", "#30D158"], isActive: false },
];

const CardItem = ({ card, index, onPress, onToggle }) => {
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
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardType}>Sanal Kart</Text>
            </View>
            <TouchableOpacity style={styles.toggleButton} onPress={() => onToggle(card.id)}>
              <Icon
                name={card.isActive ? "toggle-right" : "toggle-left"}
                size={24}
                color={card.isActive ? "#4ADE80" : "rgba(255,255,255,0.5)"}
              />
            </TouchableOpacity>
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
  const [selectedType, setSelectedType] = useState(null);
  const [cardName, setCardName] = useState("");
  const [step, setStep] = useState(1); // 1: type selection, 2: name input

  const handleCardPress = (card) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Could navigate to card detail screen
  };

  const handleToggleCard = (cardId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCards(cards.map((card) => card.id === cardId ? { ...card, isActive: !card.isActive } : card));
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
    const newCard = {
      id: String(Date.now()),
      type: selectedType.id,
      name: cardName.trim(),
      number: String(Math.floor(1000 + Math.random() * 9000)),
      expiry: "01/30",
      balance: 0,
      gradient: selectedType.gradient,
      isActive: true,
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
          <CardItem key={card.id} card={card} index={index} onPress={handleCardPress} onToggle={handleToggleCard} />
        ))}

        <FadeSlide delay={cards.length * 150 + 100}>
          <TouchableOpacity style={[styles.addCardButton, { backgroundColor: `${colors.PRIMARY}10`, borderColor: colors.PRIMARY }]} onPress={handleAddCard}>
            <Icon name="plus-circle" size={24} color={colors.PRIMARY} />
            <Text style={[styles.addCardText, { color: colors.PRIMARY }]}>Yeni Kart Ekle</Text>
          </TouchableOpacity>
        </FadeSlide>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.OVERLAY }]}>
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: Spacing.lg },
  cardName: { ...TextStyles.labelLarge, color: "#FFFFFF" },
  cardType: { ...TextStyles.caption, color: "rgba(255,255,255,0.7)" },
  toggleButton: { padding: Spacing.xxs },
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
  modalContent: { borderTopLeftRadius: BorderRadius["2xl"], borderTopRightRadius: BorderRadius["2xl"], paddingBottom: Spacing["2xl"], maxHeight: "85%" },
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
});

export default CardsScreen;
