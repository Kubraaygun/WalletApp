import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { Colors, Gradients } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - Spacing.md * 2;

const MOCK_CARDS = [
  {
    id: "1",
    type: "virtual",
    name: "Ana Kart",
    number: "4582",
    expiry: "12/28",
    balance: 15420.5,
    gradient: ["#007AFF", "#5856D6"],
    isActive: true,
  },
  {
    id: "2",
    type: "virtual",
    name: "Alışveriş Kartı",
    number: "7891",
    expiry: "06/27",
    balance: 2500.0,
    gradient: ["#1C1C1E", "#3A3A3C"],
    isActive: true,
  },
  {
    id: "3",
    type: "virtual",
    name: "Tasarruf Kartı",
    number: "3456",
    expiry: "03/29",
    balance: 8750.0,
    gradient: ["#34C759", "#30D158"],
    isActive: false,
  },
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
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardType}>Sanal Kart</Text>
            </View>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => onToggle(card.id)}
            >
              <Icon
                name={card.isActive ? "toggle-right" : "toggle-left"}
                size={24}
                color={card.isActive ? "#4ADE80" : "rgba(255,255,255,0.5)"}
              />
            </TouchableOpacity>
          </View>

          {/* Card Number */}
          <View style={styles.cardNumberRow}>
            <Text style={styles.cardDots}>•••• •••• ••••</Text>
            <Text style={styles.cardLastDigits}>{card.number}</Text>
          </View>

          {/* Card Footer */}
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

          {/* Decorative elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </LinearGradient>
      </TouchableOpacity>
    </FadeSlide>
  );
};

const CardsScreen = ({ navigation }) => {
  const [cards, setCards] = useState(MOCK_CARDS);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCardPress = (card) => {
    Alert.alert(
      card.name,
      `Kart No: •••• ${card.number}\nBakiye: ₺${card.balance.toLocaleString("tr-TR")}`,
      [
        { text: "Kapat" },
        {
          text: "Detaylar",
          onPress: () => {},
        },
      ]
    );
  };

  const handleToggleCard = (cardId) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, isActive: !card.isActive } : card
      )
    );
  };

  const handleAddCard = () => {
    Alert.alert("Yeni Kart", "Yeni sanal kart oluşturulsun mu?", [
      { text: "İptal" },
      {
        text: "Oluştur",
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

  const totalBalance = cards
    .filter((c) => c.isActive)
    .reduce((sum, card) => sum + card.balance, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Kartlarım</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
          <Icon name="plus" size={IconSize.md} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Balance */}
        <FadeSlide delay={0}>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Toplam Bakiye</Text>
            <Text style={styles.totalAmount}>
              ₺{totalBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.totalInfo}>{cards.filter((c) => c.isActive).length} aktif kart</Text>
          </View>
        </FadeSlide>

        {/* Cards List */}
        <Text style={styles.sectionTitle}>Sanal Kartlar</Text>
        {cards.map((card, index) => (
          <CardItem
            key={card.id}
            card={card}
            index={index}
            onPress={handleCardPress}
            onToggle={handleToggleCard}
          />
        ))}

        {/* Add Card Button */}
        <FadeSlide delay={cards.length * 150 + 100}>
          <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
            <Icon name="plus-circle" size={24} color={Colors.PRIMARY} />
            <Text style={styles.addCardText}>Yeni Kart Ekle</Text>
          </TouchableOpacity>
        </FadeSlide>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
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
    backgroundColor: Colors.SURFACE,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...TextStyles.h3,
    color: Colors.TEXT_PRIMARY,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.PRIMARY}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  totalCard: {
    backgroundColor: Colors.SURFACE,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: "center",
  },
  totalLabel: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
  },
  totalAmount: {
    ...TextStyles.displayLarge,
    color: Colors.TEXT_PRIMARY,
    marginVertical: Spacing.xs,
  },
  totalInfo: {
    ...TextStyles.caption,
    color: Colors.TEXT_SECONDARY,
  },
  sectionTitle: {
    ...TextStyles.h4,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.md,
  },
  cardContainer: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: "hidden",
    ...Shadows.lg,
  },
  cardInactive: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  cardName: {
    ...TextStyles.labelLarge,
    color: Colors.WHITE,
  },
  cardType: {
    ...TextStyles.caption,
    color: "rgba(255,255,255,0.7)",
  },
  toggleButton: {
    padding: Spacing.xxs,
  },
  cardNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  cardDots: {
    ...TextStyles.h4,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 2,
  },
  cardLastDigits: {
    ...TextStyles.h4,
    color: Colors.WHITE,
    marginLeft: Spacing.xs,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    ...TextStyles.caption,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 2,
  },
  cardBalance: {
    ...TextStyles.labelLarge,
    color: Colors.WHITE,
  },
  cardExpiry: {
    ...TextStyles.labelMedium,
    color: Colors.WHITE,
  },
  decorCircle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -40,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${Colors.PRIMARY}10`,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderStyle: "dashed",
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  addCardText: {
    ...TextStyles.labelLarge,
    color: Colors.PRIMARY,
    marginLeft: Spacing.sm,
  },
});

export default CardsScreen;
