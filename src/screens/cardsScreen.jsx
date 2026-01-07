import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - Spacing.md * 2;

const MOCK_CARDS = [
  { id: "1", type: "virtual", name: "Ana Kart", number: "4582", expiry: "12/28", balance: 15420.5, gradient: ["#007AFF", "#5856D6"], isActive: true },
  { id: "2", type: "virtual", name: "Alisveris Karti", number: "7891", expiry: "06/27", balance: 2500.0, gradient: ["#1C1C1E", "#3A3A3C"], isActive: true },
  { id: "3", type: "virtual", name: "Tasarruf Karti", number: "3456", expiry: "03/29", balance: 8750.0, gradient: ["#34C759", "#30D158"], isActive: false },
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

const CardsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [cards, setCards] = useState(MOCK_CARDS);

  const handleCardPress = (card) => {
    Alert.alert(
      card.name,
      `Kart No: •••• ${card.number}\nBakiye: ₺${card.balance.toLocaleString("tr-TR")}`,
      [{ text: "Kapat" }, { text: "Detaylar", onPress: () => {} }]
    );
  };

  const handleToggleCard = (cardId) => {
    setCards(cards.map((card) => card.id === cardId ? { ...card, isActive: !card.isActive } : card));
  };

  const handleAddCard = () => {
    Alert.alert("Yeni Kart", "Yeni sanal kart olusturulsun mu?", [
      { text: "Iptal" },
      {
        text: "Olustur",
        onPress: () => {
          const newCard = {
            id: String(cards.length + 1),
            type: "virtual",
            name: `Kart ${cards.length + 1}`,
            number: String(Math.floor(1000 + Math.random() * 9000)),
            expiry: "01/30",
            balance: 0,
            gradient: ["#FF9500", "#FF6B00"],
            isActive: true,
          };
          setCards([...cards, newCard]);
        },
      },
    ]);
  };

  const totalBalance = cards.filter((c) => c.isActive).reduce((sum, card) => sum + card.balance, 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />

      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Kartlarim</Text>
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
});

export default CardsScreen;
