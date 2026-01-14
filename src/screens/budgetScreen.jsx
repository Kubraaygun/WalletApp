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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  selectCategories,
  selectMonthlyBudget,
  selectTotalSpent,
  setMonthlyBudget,
  setCategoryBudget,
  resetBudget,
} from "../store/budgetSlice";

const BudgetScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const monthlyBudget = useSelector(selectMonthlyBudget);
  const totalSpent = useSelector(selectTotalSpent);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState("");
  const [monthlyModalVisible, setMonthlyModalVisible] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (spent, budget) => {
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return colors.ERROR;
    if (percentage >= 80) return colors.WARNING;
    return colors.SUCCESS;
  };

  const handleCategoryPress = (category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
    setBudgetInput(category.budget > 0 ? category.budget.toString() : "");
    setEditModalVisible(true);
  };

  const handleSaveCategoryBudget = () => {
    const amount = parseInt(budgetInput) || 0;
    if (amount > 100000) {
      Alert.alert("Hata", "Maksimum bütçe ₺100.000 olabilir");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(setCategoryBudget({ categoryId: selectedCategory.id, amount }));
    setEditModalVisible(false);
    setBudgetInput("");
  };

  const handleSetMonthlyBudget = () => {
    const amount = parseInt(monthlyBudgetInput) || 0;
    if (amount > 1000000) {
      Alert.alert("Hata", "Maksimum bütçe ₺1.000.000 olabilir");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(setMonthlyBudget(amount));
    setMonthlyModalVisible(false);
    setMonthlyBudgetInput("");
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Bütçeyi Sıfırla",
      "Tüm bütçe ayarlarınız sıfırlanacak. Devam etmek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sıfırla",
          style: "destructive",
          onPress: () => {
            dispatch(resetBudget());
          }
        }
      ]
    );
  };

  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const overallPercentage = getProgressPercentage(totalSpent, totalBudget || monthlyBudget);

  const CategoryCard = ({ category }) => {
    const percentage = getProgressPercentage(category.spent, category.budget);
    const progressColor = getProgressColor(percentage);
    
    return (
      <TouchableOpacity
        style={[styles.categoryCard, { backgroundColor: colors.SURFACE }]}
        onPress={() => handleCategoryPress(category)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
            <Icon name={category.icon} size={20} color={category.color} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={[styles.categoryName, { color: colors.TEXT_PRIMARY }]}>
              {category.name}
            </Text>
            {category.budget > 0 ? (
              <Text style={[styles.categoryAmount, { color: colors.TEXT_SECONDARY }]}>
                ₺{formatAmount(category.spent)} / ₺{formatAmount(category.budget)}
              </Text>
            ) : (
              <Text style={[styles.categoryAmount, { color: colors.GRAY_400 }]}>
                Bütçe belirlenmedi
              </Text>
            )}
          </View>
          <Text style={[styles.percentageText, { color: progressColor }]}>
            {category.budget > 0 ? `%${Math.round(percentage)}` : "-"}
          </Text>
        </View>
        
        {category.budget > 0 && (
          <View style={[styles.progressBar, { backgroundColor: colors.GRAY_200 }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: progressColor,
                  width: `${percentage}%`,
                }
              ]} 
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Bütçe Takibi</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Icon name="refresh-cw" size={18} color={colors.TEXT_SECONDARY} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Progress Card */}
        <TouchableOpacity
          style={[styles.overallCard, { backgroundColor: colors.PRIMARY }]}
          onPress={() => {
            setMonthlyBudgetInput(monthlyBudget > 0 ? monthlyBudget.toString() : "");
            setMonthlyModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.overallHeader}>
            <Text style={styles.overallLabel}>Bu Ay Toplam Harcama</Text>
            <Icon name="edit-2" size={16} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={styles.overallAmount}>₺{formatAmount(totalSpent)}</Text>
          <View style={styles.overallBudgetRow}>
            <Text style={styles.overallBudgetText}>
              Bütçe: ₺{formatAmount(totalBudget || monthlyBudget)}
            </Text>
            <Text style={styles.overallPercentage}>
              %{Math.round(overallPercentage)}
            </Text>
          </View>
          <View style={styles.overallProgressBar}>
            <View 
              style={[
                styles.overallProgressFill, 
                { width: `${overallPercentage}%` }
              ]} 
            />
          </View>
          {overallPercentage >= 80 && (
            <View style={styles.warningBadge}>
              <Icon name="alert-triangle" size={14} color="#FFF" />
              <Text style={styles.warningText}>
                {overallPercentage >= 100 ? "Bütçe aşıldı!" : "Bütçe sınırına yaklaşıyor"}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>
            KATEGORİLER
          </Text>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>

        {/* Tips */}
        <View style={[styles.tipBox, { backgroundColor: `${colors.INFO}10` }]}>
          <Icon name="info" size={16} color={colors.INFO} />
          <Text style={[styles.tipText, { color: colors.INFO }]}>
            Kategori bütçelerini belirlemek için üzerine dokunun
          </Text>
        </View>
      </ScrollView>

      {/* Category Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <GestureHandlerRootView style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.BACKGROUND }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>
                {selectedCategory?.name} Bütçesi
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="x" size={24} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>
                Aylık Bütçe (₺)
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
                value={budgetInput}
                onChangeText={(text) => setBudgetInput(text.replace(/[^0-9]/g, ""))}
                placeholder="0"
                placeholderTextColor={colors.GRAY_400}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.BORDER }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.TEXT_PRIMARY }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.PRIMARY }]}
                onPress={handleSaveCategoryBudget}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>

      {/* Monthly Budget Modal */}
      <Modal
        visible={monthlyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMonthlyModalVisible(false)}
      >
        <GestureHandlerRootView style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.BACKGROUND }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>
                Aylık Toplam Bütçe
              </Text>
              <TouchableOpacity onPress={() => setMonthlyModalVisible(false)}>
                <Icon name="x" size={24} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>
                Hedef Bütçe (₺)
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
                value={monthlyBudgetInput}
                onChangeText={(text) => setMonthlyBudgetInput(text.replace(/[^0-9]/g, ""))}
                placeholder="0"
                placeholderTextColor={colors.GRAY_400}
                keyboardType="number-pad"
                maxLength={7}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.BORDER }]}
                onPress={() => setMonthlyModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.TEXT_PRIMARY }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.PRIMARY }]}
                onPress={handleSetMonthlyBudget}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GestureHandlerRootView>
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
  resetButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  overallCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  overallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  overallLabel: {
    ...TextStyles.labelMedium,
    color: "rgba(255,255,255,0.8)",
  },
  overallAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: Spacing.sm,
  },
  overallBudgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  overallBudgetText: {
    ...TextStyles.bodySmall,
    color: "rgba(255,255,255,0.7)",
  },
  overallPercentage: {
    ...TextStyles.labelMedium,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  overallProgressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    alignSelf: "flex-start",
    gap: Spacing.xxs,
  },
  warningText: {
    ...TextStyles.caption,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.caption,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  categoryCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  categoryName: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
  },
  categoryAmount: {
    ...TextStyles.caption,
    marginTop: 2,
  },
  percentageText: {
    ...TextStyles.labelMedium,
    fontWeight: "700",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: Spacing.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
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
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...TextStyles.labelSmall,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 56,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.sm,
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

export default BudgetScreen;
