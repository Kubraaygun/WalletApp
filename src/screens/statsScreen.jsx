import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Feather as Icon } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";
import {
  selectCategories,
  selectMonthlyBudget,
  selectTodayTotal,
  selectWeekTotal,
  selectMonthTotal,
  selectCategoriesWithSpent,
  selectLast7DaysData,
  selectCategoryTotals,
  selectExpenses,
  setCategoryBudget,
  addExpense,
  removeExpense,
} from "../store/budgetSlice";

const { width } = Dimensions.get("window");

const StatsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("stats");
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
  // Redux selectors
  const categories = useSelector(selectCategories);
  const categoriesWithSpent = useSelector(selectCategoriesWithSpent);
  const monthlyBudget = useSelector(selectMonthlyBudget);
  const todayTotal = useSelector(selectTodayTotal);
  const weekTotal = useSelector(selectWeekTotal);
  const monthTotal = useSelector(selectMonthTotal);
  const last7DaysData = useSelector(selectLast7DaysData);
  const categoryTotals = useSelector(selectCategoryTotals);
  const allExpenses = useSelector(selectExpenses);
  
  // Modal states
  const [addExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [budgetInput, setBudgetInput] = useState("");

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

  // Chart config
  const chartConfig = {
    backgroundColor: colors.CARD,
    backgroundGradientFrom: colors.CARD,
    backgroundGradientTo: colors.CARD,
    decimalPlaces: 0,
    color: () => colors.PRIMARY,
    labelColor: () => colors.TEXT_SECONDARY,
    style: { borderRadius: BorderRadius.lg },
    propsForDots: { r: "4", strokeWidth: "2", stroke: colors.PRIMARY },
  };

  // Line chart data from real expenses
  const lineChartData = {
    labels: last7DaysData.map((d) => d.day),
    datasets: [{
      data: last7DaysData.map((d) => d.amount || 0),
      color: () => colors.PRIMARY,
      strokeWidth: 2,
    }],
  };

  // Pie chart data from real expenses
  const pieChartData = categoryTotals.length > 0
    ? categoryTotals.map((item) => ({
        name: item.name,
        population: item.amount,
        color: item.color,
        legendFontColor: colors.TEXT_PRIMARY,
        legendFontSize: 12,
      }))
    : [{ name: "Veri yok", population: 1, color: colors.GRAY_300, legendFontColor: colors.TEXT_SECONDARY, legendFontSize: 12 }];

  const totalBudget = categoriesWithSpent.reduce((sum, c) => sum + c.budget, 0);
  const overallPercentage = getProgressPercentage(monthTotal, totalBudget || monthlyBudget);

  // Handlers
  const handleAddExpense = () => {
    if (!selectedCategory) {
      Alert.alert("Hata", "Lütfen bir kategori seçin");
      return;
    }
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Hata", "Geçerli bir tutar girin");
      return;
    }
    if (amount > 100000) {
      Alert.alert("Hata", "Maksimum ₺100.000 eklenebilir");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(addExpense({
      categoryId: selectedCategory.id,
      amount,
      description: expenseDescription.trim(),
    }));
    
    setAddExpenseModalVisible(false);
    setSelectedCategory(null);
    setExpenseAmount("");
    setExpenseDescription("");
  };

  const handleCategoryPress = (category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBudgetInput(category.budget > 0 ? category.budget.toString() : "");
    setSelectedCategory(category);
    setBudgetModalVisible(true);
  };

  const handleSaveBudget = () => {
    const amount = parseInt(budgetInput) || 0;
    if (amount > 100000) {
      Alert.alert("Hata", "Maksimum bütçe ₺100.000");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(setCategoryBudget({ categoryId: selectedCategory.id, amount }));
    setBudgetModalVisible(false);
    setBudgetInput("");
  };

  const handleDeleteExpense = (expense) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Harcama Sil",
      `₺${formatAmount(expense.amount)} - ${expense.categoryName} silinsin mi?`,
      [
        { text: "İptal", style: "cancel" },
        { text: "Sil", style: "destructive", onPress: () => dispatch(removeExpense(expense.id)) }
      ]
    );
  };

  // Stats Content
  const StatsContent = () => (
    <>
      {/* Period Stats */}
      <View style={styles.periodStats}>
        <View style={[styles.periodCard, { backgroundColor: colors.SURFACE }]}>
          <Text style={[styles.periodLabel, { color: colors.TEXT_SECONDARY }]}>Bugün</Text>
          <Text style={[styles.periodAmount, { color: colors.TEXT_PRIMARY }]}>₺{formatAmount(todayTotal)}</Text>
        </View>
        <View style={[styles.periodCard, { backgroundColor: colors.SURFACE }]}>
          <Text style={[styles.periodLabel, { color: colors.TEXT_SECONDARY }]}>Bu Hafta</Text>
          <Text style={[styles.periodAmount, { color: colors.TEXT_PRIMARY }]}>₺{formatAmount(weekTotal)}</Text>
        </View>
        <View style={[styles.periodCard, { backgroundColor: colors.SURFACE }]}>
          <Text style={[styles.periodLabel, { color: colors.TEXT_SECONDARY }]}>Bu Ay</Text>
          <Text style={[styles.periodAmount, { color: colors.TEXT_PRIMARY }]}>₺{formatAmount(monthTotal)}</Text>
        </View>
      </View>

      {/* Line Chart */}
      <FadeSlide delay={100}>
        <View style={[styles.chartCard, { backgroundColor: colors.CARD }]}>
          <Text style={[styles.chartTitle, { color: colors.TEXT_PRIMARY }]}>Son 7 Gün</Text>
          {last7DaysData.some((d) => d.amount > 0) ? (
            <LineChart
              data={lineChartData}
              width={width - Spacing.md * 4}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Icon name="bar-chart-2" size={40} color={colors.GRAY_300} />
              <Text style={[styles.noDataText, { color: colors.TEXT_SECONDARY }]}>
                Henüz harcama kaydı yok
              </Text>
            </View>
          )}
        </View>
      </FadeSlide>

      {/* Pie Chart */}
      <FadeSlide delay={200}>
        <View style={[styles.chartCard, { backgroundColor: colors.CARD }]}>
          <Text style={[styles.chartTitle, { color: colors.TEXT_PRIMARY }]}>Kategori Dağılımı</Text>
          <PieChart
            data={pieChartData}
            width={width - Spacing.md * 4}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </FadeSlide>

      {/* Recent Expenses */}
      <FadeSlide delay={300}>
        <View style={[styles.recentCard, { backgroundColor: colors.CARD }]}>
          <Text style={[styles.chartTitle, { color: colors.TEXT_PRIMARY }]}>Son Harcamalar</Text>
          {allExpenses.slice(0, 5).length > 0 ? (
            allExpenses.slice(0, 5).map((expense) => (
              <TouchableOpacity
                key={expense.id}
                style={[styles.expenseItem, { borderBottomColor: colors.BORDER }]}
                onLongPress={() => handleDeleteExpense(expense)}
              >
                <View style={[styles.expenseIcon, { backgroundColor: `${expense.categoryColor}20` }]}>
                  <Icon name={expense.categoryIcon} size={16} color={expense.categoryColor} />
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={[styles.expenseCat, { color: colors.TEXT_PRIMARY }]}>{expense.categoryName}</Text>
                  <Text style={[styles.expenseDesc, { color: colors.TEXT_SECONDARY }]}>
                    {expense.description || new Date(expense.date).toLocaleDateString("tr-TR")}
                  </Text>
                </View>
                <Text style={[styles.expenseAmount, { color: colors.ERROR }]}>-₺{formatAmount(expense.amount)}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.noDataText, { color: colors.TEXT_SECONDARY, textAlign: "center", paddingVertical: Spacing.lg }]}>
              Henüz harcama yok
            </Text>
          )}
        </View>
      </FadeSlide>
    </>
  );

  // Budget Content
  const BudgetContent = () => (
    <>
      {categoriesWithSpent.map((category, index) => {
        const percentage = getProgressPercentage(category.spent, category.budget);
        const progressColor = getProgressColor(percentage);
        
        return (
          <FadeSlide key={category.id} delay={index * 50}>
            <TouchableOpacity
              style={[styles.budgetCard, { backgroundColor: colors.SURFACE }]}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}
            >
              <View style={styles.budgetHeader}>
                <View style={[styles.budgetIcon, { backgroundColor: `${category.color}20` }]}>
                  <Icon name={category.icon} size={20} color={category.color} />
                </View>
                <View style={styles.budgetInfo}>
                  <Text style={[styles.budgetName, { color: colors.TEXT_PRIMARY }]}>{category.name}</Text>
                  <Text style={[styles.budgetAmount, { color: colors.TEXT_SECONDARY }]}>
                    ₺{formatAmount(category.spent)} {category.budget > 0 ? `/ ₺${formatAmount(category.budget)}` : ""}
                  </Text>
                </View>
                <Text style={[styles.percentageText, { color: category.budget > 0 ? progressColor : colors.GRAY_400 }]}>
                  {category.budget > 0 ? `%${Math.round(percentage)}` : "-"}
                </Text>
              </View>
              {category.budget > 0 && (
                <View style={[styles.progressBar, { backgroundColor: colors.GRAY_200 }]}>
                  <View style={[styles.progressFill, { backgroundColor: progressColor, width: `${percentage}%` }]} />
                </View>
              )}
            </TouchableOpacity>
          </FadeSlide>
        );
      })}
      <View style={[styles.infoBox, { backgroundColor: `${colors.INFO}10` }]}>
        <Icon name="info" size={16} color={colors.INFO} />
        <Text style={[styles.infoText, { color: colors.INFO }]}>Bütçe belirlemek için kategoriye dokunun</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Mali Durum</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddExpenseModalVisible(true)}
        >
          <Icon name="plus" size={IconSize.md} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabSelector, { backgroundColor: colors.SURFACE, marginHorizontal: Spacing.md }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "stats" && [styles.tabButtonActive, { backgroundColor: colors.CARD }]]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab("stats"); }}
        >
          <Icon name="pie-chart" size={16} color={activeTab === "stats" ? colors.PRIMARY : colors.TEXT_SECONDARY} />
          <Text style={[styles.tabText, { color: activeTab === "stats" ? colors.PRIMARY : colors.TEXT_SECONDARY }]}>İstatistikler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "budget" && [styles.tabButtonActive, { backgroundColor: colors.CARD }]]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab("budget"); }}
        >
          <Icon name="target" size={16} color={activeTab === "budget" ? colors.PRIMARY : colors.TEXT_SECONDARY} />
          <Text style={[styles.tabText, { color: activeTab === "budget" ? colors.PRIMARY : colors.TEXT_SECONDARY }]}>Bütçe</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <FadeSlide delay={0}>
          <View style={[styles.summaryCard, { backgroundColor: colors.PRIMARY }]}>
            <Text style={styles.summaryLabel}>Bu Ay Toplam</Text>
            <Text style={styles.summaryAmount}>₺{formatAmount(monthTotal)}</Text>
            {totalBudget > 0 && (
              <>
                <View style={styles.budgetRow}>
                  <Text style={styles.budgetText}>Bütçe: ₺{formatAmount(totalBudget)}</Text>
                  <Text style={styles.budgetPercent}>%{Math.round(overallPercentage)}</Text>
                </View>
                <View style={styles.overallProgressBar}>
                  <View style={[styles.overallProgressFill, { width: `${overallPercentage}%` }]} />
                </View>
              </>
            )}
          </View>
        </FadeSlide>

        {activeTab === "stats" ? <StatsContent /> : <BudgetContent />}
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal visible={addExpenseModalVisible} animationType="slide" transparent onRequestClose={() => setAddExpenseModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.BACKGROUND }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>Harcama Ekle</Text>
              <TouchableOpacity onPress={() => setAddExpenseModalVisible(false)}>
                <Icon name="x" size={24} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {/* Category Selection */}
            <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: selectedCategory?.id === cat.id ? cat.color : colors.SURFACE, borderColor: cat.color }
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Icon name={cat.icon} size={16} color={selectedCategory?.id === cat.id ? "#FFF" : cat.color} />
                  <Text style={[styles.categoryChipText, { color: selectedCategory?.id === cat.id ? "#FFF" : colors.TEXT_PRIMARY }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Amount Input */}
            <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY, marginTop: Spacing.md }]}>Tutar (₺)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
              value={expenseAmount}
              onChangeText={(t) => setExpenseAmount(t.replace(/[^0-9.]/g, ""))}
              placeholder="0"
              placeholderTextColor={colors.GRAY_400}
              keyboardType="decimal-pad"
              maxLength={8}
            />

            {/* Description Input */}
            <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY, marginTop: Spacing.sm }]}>Açıklama (opsiyonel)</Text>
            <TextInput
              style={[styles.descInput, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
              value={expenseDescription}
              onChangeText={setExpenseDescription}
              placeholder="Kahve, market vb."
              placeholderTextColor={colors.GRAY_400}
              maxLength={100}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton, { borderColor: colors.BORDER }]} onPress={() => setAddExpenseModalVisible(false)}>
                <Text style={[styles.cancelButtonText, { color: colors.TEXT_PRIMARY }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.PRIMARY }]} onPress={handleAddExpense}>
                <Text style={styles.saveButtonText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Budget Edit Modal */}
      <Modal visible={budgetModalVisible} animationType="slide" transparent onRequestClose={() => setBudgetModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.BACKGROUND }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>{selectedCategory?.name} Bütçesi</Text>
              <TouchableOpacity onPress={() => setBudgetModalVisible(false)}>
                <Icon name="x" size={24} color={colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}>Aylık Bütçe (₺)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.SURFACE, color: colors.TEXT_PRIMARY, borderColor: colors.BORDER }]}
              value={budgetInput}
              onChangeText={(t) => setBudgetInput(t.replace(/[^0-9]/g, ""))}
              placeholder="0"
              placeholderTextColor={colors.GRAY_400}
              keyboardType="number-pad"
              maxLength={6}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton, { borderColor: colors.BORDER }]} onPress={() => setBudgetModalVisible(false)}>
                <Text style={[styles.cancelButtonText, { color: colors.TEXT_PRIMARY }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.PRIMARY }]} onPress={handleSaveBudget}>
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
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  headerTitle: { ...TextStyles.h3 },
  headerSpacer: { width: 44 },
  addButton: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  tabSelector: { flexDirection: "row", borderRadius: BorderRadius.lg, padding: 4, marginBottom: Spacing.md },
  tabButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, gap: Spacing.xs },
  tabButtonActive: { ...Shadows.sm },
  tabText: { ...TextStyles.labelMedium },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing["2xl"] },
  summaryCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
  summaryLabel: { ...TextStyles.labelMedium, color: "rgba(255,255,255,0.8)" },
  summaryAmount: { fontSize: 36, fontWeight: "700", color: "#FFF", marginVertical: Spacing.xs },
  budgetRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.xs },
  budgetText: { ...TextStyles.bodySmall, color: "rgba(255,255,255,0.7)" },
  budgetPercent: { ...TextStyles.labelMedium, color: "#FFF", fontWeight: "700" },
  overallProgressBar: { height: 8, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 4, overflow: "hidden" },
  overallProgressFill: { height: "100%", backgroundColor: "#FFF", borderRadius: 4 },
  periodStats: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg },
  periodCard: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg, alignItems: "center", ...Shadows.sm },
  periodLabel: { ...TextStyles.caption },
  periodAmount: { ...TextStyles.labelLarge, fontWeight: "700", marginTop: Spacing.xxs },
  chartCard: { borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.lg, ...Shadows.sm },
  chartTitle: { ...TextStyles.labelLarge, marginBottom: Spacing.md },
  chart: { borderRadius: BorderRadius.lg, marginLeft: -Spacing.sm },
  noDataContainer: { alignItems: "center", paddingVertical: Spacing.xl },
  noDataText: { ...TextStyles.bodySmall, marginTop: Spacing.sm },
  recentCard: { borderRadius: BorderRadius.xl, padding: Spacing.md, ...Shadows.sm },
  expenseItem: { flexDirection: "row", alignItems: "center", paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  expenseIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  expenseInfo: { flex: 1, marginLeft: Spacing.sm },
  expenseCat: { ...TextStyles.labelMedium },
  expenseDesc: { ...TextStyles.caption },
  expenseAmount: { ...TextStyles.labelMedium, fontWeight: "600" },
  budgetCard: { padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, ...Shadows.sm },
  budgetHeader: { flexDirection: "row", alignItems: "center" },
  budgetIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  budgetInfo: { flex: 1, marginLeft: Spacing.sm },
  budgetName: { ...TextStyles.labelMedium, fontWeight: "600" },
  budgetAmount: { ...TextStyles.caption, marginTop: 2 },
  percentageText: { ...TextStyles.labelMedium, fontWeight: "700" },
  progressBar: { height: 4, borderRadius: 2, marginTop: Spacing.sm, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  infoBox: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.sm, marginTop: Spacing.sm },
  infoText: { ...TextStyles.caption, flex: 1 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, padding: Spacing.lg, paddingBottom: Spacing["2xl"] },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.lg },
  modalTitle: { ...TextStyles.h3 },
  inputLabel: { ...TextStyles.labelSmall, marginBottom: Spacing.xs },
  categoryScroll: { marginBottom: Spacing.sm },
  categoryChip: { flexDirection: "row", alignItems: "center", paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1, marginRight: Spacing.xs, gap: Spacing.xxs },
  categoryChipText: { ...TextStyles.caption },
  input: { height: 56, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, borderWidth: 1, fontSize: 24, fontWeight: "600", textAlign: "center" },
  descInput: { height: 44, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, borderWidth: 1, ...TextStyles.bodyMedium },
  modalActions: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  modalButton: { flex: 1, height: 48, borderRadius: BorderRadius.lg, justifyContent: "center", alignItems: "center" },
  cancelButton: { borderWidth: 1 },
  cancelButtonText: { ...TextStyles.labelMedium },
  saveButton: {},
  saveButtonText: { ...TextStyles.labelMedium, color: "#FFF" },
});

export default StatsScreen;
