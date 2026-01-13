import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";
import Avatar from "../avatar";
import { selectFavorites } from "../../store/favoritesSlice";

const FavoriteContacts = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const favorites = useSelector(selectFavorites);

  const handleFavoritePress = (contact) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("TransferScreen", {
      recipient: contact.phone || contact.iban,
      recipientName: contact.name,
    });
  };

  const handleSeeAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("FavoritesScreen");
  };

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("FavoritesScreen");
  };

  // Eğer hiç favori yoksa
  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Favori Kişiler</Text>
        </View>
        <TouchableOpacity
          style={[styles.emptyCard, { backgroundColor: colors.SURFACE }]}
          onPress={handleAdd}
        >
          <View style={[styles.addIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
            <Icon name="user-plus" size={24} color={colors.PRIMARY} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.TEXT_PRIMARY }]}>
            Favori Ekle
          </Text>
          <Text style={[styles.emptyText, { color: colors.TEXT_SECONDARY }]}>
            Sık kullandığın kişileri ekle
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Favori Kişiler</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={[styles.seeAll, { color: colors.PRIMARY }]}>Tümü</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Button */}
        <TouchableOpacity
          style={[styles.addCard, { backgroundColor: colors.SURFACE, borderColor: colors.BORDER }]}
          onPress={handleAdd}
        >
          <View style={[styles.addCircle, { backgroundColor: `${colors.PRIMARY}15` }]}>
            <Icon name="plus" size={20} color={colors.PRIMARY} />
          </View>
          <Text style={[styles.addText, { color: colors.TEXT_SECONDARY }]}>Ekle</Text>
        </TouchableOpacity>

        {/* Favorites */}
        {favorites.slice(0, 6).map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={[styles.favoriteCard, { backgroundColor: colors.SURFACE }]}
            onPress={() => handleFavoritePress(contact)}
            activeOpacity={0.7}
          >
            <Avatar name={contact.name} size="md" />
            <Text 
              style={[styles.favoriteName, { color: colors.TEXT_PRIMARY }]} 
              numberOfLines={1}
            >
              {contact.name.split(" ")[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    ...TextStyles.h4,
  },
  seeAll: {
    ...TextStyles.labelMedium,
  },
  scrollView: {
    marginHorizontal: -Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  addCard: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 90,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    ...TextStyles.caption,
    marginTop: Spacing.xxs,
  },
  favoriteCard: {
    alignItems: "center",
    padding: Spacing.sm,
    width: 72,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  favoriteName: {
    ...TextStyles.caption,
    marginTop: Spacing.xxs,
    textAlign: "center",
    maxWidth: 60,
  },
  emptyCard: {
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  addIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
  },
  emptyText: {
    ...TextStyles.caption,
    marginTop: Spacing.xxs,
  },
});

export default FavoriteContacts;
