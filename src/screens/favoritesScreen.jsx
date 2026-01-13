import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import Avatar from "../components/avatar";
import {
  selectFavorites,
  selectRecentContacts,
  addFavorite,
  removeFavorite,
  clearFavorites,
} from "../store/favoritesSlice";

const FavoritesScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const recentContacts = useSelector(selectRecentContacts);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", iban: "" });

  const handleBack = () => {
    navigation.goBack();
  };

  // Input sanitization
  const sanitizeName = (text) => text.replace(/[<>{}]/g, "").slice(0, 50);
  const sanitizePhone = (text) => text.replace(/[^0-9+\s]/g, "").slice(0, 15);
  const sanitizeIban = (text) => text.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 26);

  const handleAddFavorite = () => {
    if (!newContact.name.trim()) {
      Alert.alert("Hata", "Lütfen bir isim girin");
      return;
    }
    if (!newContact.phone.trim() && !newContact.iban.trim()) {
      Alert.alert("Hata", "Telefon veya IBAN girmeniz gerekiyor");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(addFavorite({
      name: sanitizeName(newContact.name),
      phone: sanitizePhone(newContact.phone),
      iban: sanitizeIban(newContact.iban),
    }));
    setNewContact({ name: "", phone: "", iban: "" });
    setAddModalVisible(false);
  };

  const handleRemoveFavorite = (id, name) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Favoriden Kaldır",
      `${name} favorilerden kaldırılsın mı?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Kaldır",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            dispatch(removeFavorite(id));
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    if (favorites.length === 0) {
      Alert.alert("Bilgi", "Favorileriniz zaten boş");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Tümünü Temizle",
      "Tüm favorilerinizi silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Temizle",
          style: "destructive",
          onPress: () => {
            dispatch(clearFavorites());
          }
        }
      ]
    );
  };

  const handleTransfer = (contact) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("TransferScreen", { 
      recipient: contact.phone || contact.iban,
      recipientName: contact.name 
    });
  };

  const FavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.favoriteItem, { backgroundColor: colors.SURFACE }]}
      onPress={() => handleTransfer(item)}
      onLongPress={() => handleRemoveFavorite(item.id, item.name)}
      activeOpacity={0.7}
    >
      <Avatar name={item.name} size="md" />
      <View style={styles.favoriteInfo}>
        <Text style={[styles.favoriteName, { color: colors.TEXT_PRIMARY }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.favoriteDetail, { color: colors.TEXT_SECONDARY }]} numberOfLines={1}>
          {item.phone || item.iban}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.transferButton, { backgroundColor: `${colors.PRIMARY}15` }]}
        onPress={() => handleTransfer(item)}
      >
        <Icon name="send" size={16} color={colors.PRIMARY} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const RecentItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.recentItem, { backgroundColor: colors.SURFACE }]}
      onPress={() => handleTransfer(item)}
      activeOpacity={0.7}
    >
      <Avatar name={item.name} size="sm" />
      <Text style={[styles.recentName, { color: colors.TEXT_PRIMARY }]} numberOfLines={1}>
        {item.name?.split(" ")[0]}
      </Text>
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
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Favoriler</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => setAddModalVisible(true)}>
          <Icon name="plus" size={IconSize.md} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent Contacts */}
        {recentContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>
              SON KULLANILANLAR
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.recentScroll}
            >
              {recentContacts.map((item, index) => (
                <RecentItem key={item.phone || item.iban || index} item={item} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Favorites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>
              FAVORİLER ({favorites.length})
            </Text>
            {favorites.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={[styles.clearText, { color: colors.ERROR }]}>Temizle</Text>
              </TouchableOpacity>
            )}
          </View>

          {favorites.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.SURFACE }]}>
              <View style={[styles.emptyIcon, { backgroundColor: `${colors.PRIMARY}15` }]}>
                <Icon name="heart" size={32} color={colors.PRIMARY} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.TEXT_PRIMARY }]}>
                Henüz favori yok
              </Text>
              <Text style={[styles.emptyText, { color: colors.TEXT_SECONDARY }]}>
                Sık transfer yaptığınız kişileri favorilere ekleyin
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.PRIMARY }]}
                onPress={() => setAddModalVisible(true)}
              >
                <Icon name="plus" size={18} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Favori Ekle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.favoritesList}>
              {favorites.map((item) => (
                <FavoriteItem key={item.id} item={item} />
              ))}
            </View>
          )}
        </View>

        {/* Tip */}
        <View style={[styles.tipBox, { backgroundColor: `${colors.INFO}10` }]}>
          <Icon name="info" size={16} color={colors.INFO} />
          <Text style={[styles.tipText, { color: colors.INFO }]}>
            İpucu: Favorileri silmek için uzun basın
          </Text>
        </View>
      </ScrollView>

      {/* Add Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.BACKGROUND }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>
                Favori Ekle
              </Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Icon name="x" size={24} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>
                  İsim *
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
                  value={newContact.name}
                  onChangeText={(text) => setNewContact({ ...newContact, name: sanitizeName(text) })}
                  placeholder="Kişi adı"
                  placeholderTextColor={colors.GRAY_400}
                  maxLength={50}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>
                  Telefon
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
                  value={newContact.phone}
                  onChangeText={(text) => setNewContact({ ...newContact, phone: sanitizePhone(text) })}
                  placeholder="5XX XXX XX XX"
                  placeholderTextColor={colors.GRAY_400}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>
                  IBAN
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
                  value={newContact.iban}
                  onChangeText={(text) => setNewContact({ ...newContact, iban: sanitizeIban(text) })}
                  placeholder="TR00 0000 0000 0000 0000 00"
                  placeholderTextColor={colors.GRAY_400}
                  autoCapitalize="characters"
                  maxLength={26}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.BORDER }]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.TEXT_PRIMARY }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.PRIMARY }]}
                onPress={handleAddFavorite}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...TextStyles.caption,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  clearText: {
    ...TextStyles.caption,
    fontWeight: "600",
  },
  recentScroll: {
    marginTop: Spacing.xs,
  },
  recentItem: {
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
    width: 80,
    ...Shadows.sm,
  },
  recentName: {
    ...TextStyles.caption,
    marginTop: Spacing.xxs,
    textAlign: "center",
  },
  favoritesList: {
    gap: Spacing.sm,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  favoriteInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  favoriteName: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
  },
  favoriteDetail: {
    ...TextStyles.caption,
    marginTop: 2,
  },
  transferButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...TextStyles.h4,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...TextStyles.bodySmall,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  addButtonText: {
    ...TextStyles.labelMedium,
    color: "#FFFFFF",
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tipText: {
    ...TextStyles.caption,
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...TextStyles.h3,
  },
  modalForm: {
    gap: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    ...TextStyles.labelSmall,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    ...TextStyles.bodyMedium,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    ...TextStyles.labelMedium,
  },
  saveButton: {},
  saveButtonText: {
    ...TextStyles.labelMedium,
    color: "#FFFFFF",
  },
});

export default FavoritesScreen;
