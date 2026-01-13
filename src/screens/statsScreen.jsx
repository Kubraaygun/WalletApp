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
  selectTotalSpent,
  setMonthlyBudget,
  setCategoryBudget,
} from "../store/budgetSlice";

const { width } = Dimensions.get("window");

const StatsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("stats"); // stats veya budget
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  // Budget state
  const budgetCategories = useSelector(selectCategories);
  const monthlyBudget = useSelector(selectMonthlyBudget);
  const totalBudgetSpent = useSelector(selectTotalSpent);
  
  // Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");

  const periods = [
    { id: "week", label: "Hafta" },
    { id: "month", label: "Ay" },
    { id: "year", label: "Yıl" },
  ];

  const spendingData = {
    week: [850, 1200, 450, 2100, 1800, 950, 1500],
    month: [4500, 5200, 3800, 6100, 4800, 5500, 4200, 3900, 5800, 4100, 5300, 4700],
    year: [45000, 52000, 48000, 61000, 55000, 58000, 62000, 54000, 49000, 53000, 57000, 51000],
  };

  const categoryData = [
    { name: "Market", amount: 3500, color: colors.PRIMARY },
    { name: "Ulaşım", amount: 1200, color: colors.SECONDARY },
    { name: "Yemek", amount: 2800, color: "#FF9500" },
    { name: "Eğlence", amount: 1500, color: colors.SUCCESS },
    { name: "Diğer", amount: 1000, color: colors.GRAY_500 },
  ];

  const pieChartData = categoryData.map((item) => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: colors.TEXT_PRIMARY,
    legendFontSize: 12,
  }));

  const lineChartData = {
    labels: selectedPeriod === "week" 
      ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
      : selectedPeriod === "month"
      ? ["1", "5", "10", "15", "20", "25", "30"]
      : ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
    datasets: [
      {
        data: spendingData[selectedPeriod].slice(0, 7),
        color: () => colors.PRIMARY,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.CARD,
    backgroundGradientFrom: colors.CARD,
    backgroundGradientTo: colors.CARD,
    decimalPlaces: 0,
    color: () => colors.PRIMARY,
    labelColor: () => colors.TEXT_SECONDARY,
    style: {
      borderRadius: BorderRadius.lg,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.PRIMARY,
    },
  };

  const totalSpending = categoryData.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = budgetCategories.reduce((sum, c) => sum + c.budget, 0);

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

  const overallPercentage = getProgressPercentage(totalBudgetSpent, totalBudget || monthlyBudget);

  // Stats Tab Content
  const StatsContent = () => (
    <>
      {/* Period Selector */}
      <FadeSlide delay={100}>
        <View style={[styles.periodSelector, { backgroundColor: colors.SURFACE }]}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && [styles.periodButtonActive, { backgroundColor: colors.CARD }],
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodText,
                  { color: colors.TEXT_SECONDARY },
                  selectedPeriod === period.id && { color: colors.PRIMARY },
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </FadeSlide>

      {/* Line Chart */}
      <FadeSlide delay={200}>
        <View style={[styles.chartCard, { backgroundColor: colors.CARD }]}>
          <Text style={[styles.chartTitle, { color: colors.TEXT_PRIMARY }]}>Harcama Trendi</Text>
          <LineChart
            data={lineChartData}
            width={width - Spacing.md * 4}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </FadeSlide>

      {/* Pie Chart */}
      <FadeSlide delay={300}>
        <View style={[styles.chartCard, { backgroundColor: colors.CARD }]}>
          <Text style={[styles.chartTitle, { color: colors.TEXT_PRIMARY }]}>Kategori Dağılımı</Text>
          <PieChart
            data={pieChartData}
            width={width - Spacing.md * 4}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </FadeSlide>

      {/* Category List */}
      <FadeSlide delay={400}>
        <View style={[styles.categoryList, { backgroundColor: colors.CARD }]}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Kategoriler</Text>
          {categoryData.map((category, index) => (
            <View key={index} style={[styles.categoryItem, { borderBottomColor: colors.BORDER }]}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={[styles.categoryName, { color: colors.TEXT_PRIMARY }]}>{category.name}</Text>
              </View>
              <Text style={[styles.categoryAmount, { color: colors.TEXT_PRIMARY }]}>
                ₺{category.amount.toLocaleString("tr-TR")}
              </Text>
            </View>
          ))}
        </View>
      </FadeSlide>
    </>
  );

  // Budget Tab Content
  const BudgetContent = () => (
    <>
      {/* Budget Categories */}
      {budgetCategories.map((category, index) => {
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
                  <Text style={[styles.budgetName, { color: colors.TEXT_PRIMARY }]}>
                    {category.name}
                  </Text>
                  {category.budget > 0 ? (
                    <Text style={[styles.budgetAmount, { color: colors.TEXT_SECONDARY }]}>
                      ₺{formatAmount(category.spent)} / ₺{formatAmount(category.budget)}
                    </Text>
                  ) : (
                    <Text style={[styles.budgetAmount, { color: colors.GRAY_400 }]}>
                      Bütçe belirle →
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
          </FadeSlide>
        );
      })}

      {/* Info Box */}
      <View style={[styles.infoBox, { backgroundColor: `${colors.INFO}10` }]}>
        <Icon name="info" size={16} color={colors.INFO} />
        <Text style={[styles.infoText, { color: colors.INFO }]}>
          Kategori bütçelerini belirlemek için üzerine dokunun
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Mali Durum</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabSelector, { backgroundColor: colors.SURFACE, marginHorizontal: Spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "stats" && [styles.tabButtonActive, { backgroundColor: colors.CARD }],
          ]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab("stats"); }}
        >
          <Icon name="pie-chart" size={16} color={activeTab === "stats" ? colors.PRIMARY : colors.TEXT_SECONDARY} />
          <Text
            style={[
              styles.tabText,
              { color: colors.TEXT_SECONDARY },
              activeTab === "stats" && { color: colors.PRIMARY },
            ]}
          >
            İstatistikler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "budget" && [styles.tabButtonActive, { backgroundColor: colors.CARD }],
          ]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab("budget"); }}
        >
          <Icon name="target" size={16} color={activeTab === "budget" ? colors.PRIMARY : colors.TEXT_SECONDARY} />
          <Text
            style={[
              styles.tabText,
              { color: colors.TEXT_SECONDARY },
              activeTab === "budget" && { color: colors.PRIMARY },
            ]}
          >
            Bütçe Takibi
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <FadeSlide delay={0}>
          <View style={[styles.summaryCard, { backgroundColor: colors.PRIMARY }]}>
            <Text style={styles.summaryLabel}>
              {activeTab === "stats" ? "Bu Ay Toplam Harcama" : "Bütçe Durumu"}
            </Text>
            <Text style={styles.summaryAmount}>
              ₺{formatAmount(activeTab === "stats" ? totalSpending : totalBudgetSpent)}
            </Text>
            {activeTab === "stats" ? (
              <View style={styles.summaryChange}>
                <Icon name="trending-down" size={14} color={colors.SUCCESS} />
                <Text style={styles.changeText}>Geçen aya göre %12 daha az</Text>
              </View>
            ) : (
              <>
                <View style={styles.budgetRow}>
                  <Text style={styles.budgetText}>
                    Bütçe: ₺{formatAmount(totalBudget || monthlyBudget)}
                  </Text>
                  <Text style={styles.budgetPercent}>%{Math.round(overallPercentage)}</Text>
                </View>
                <View style={styles.overallProgressBar}>
                  <View style={[styles.overallProgressFill, { width: `${overallPercentage}%` }]} />
                </View>
              </>
            )}
          </View>
        </FadeSlide>

        {/* Tab Content */}
        {activeTab === "stats" ? <StatsContent /> : <BudgetContent />}
      </ScrollView>

      {/* Category Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
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
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    ...TextStyles.h3,
  },
  headerSpacer: {
    width: 44,
  },
  tabSelector: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  tabButtonActive: {
    ...Shadows.sm,
  },
  tabText: {
    ...TextStyles.labelMedium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  summaryCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    ...TextStyles.labelMedium,
    color: "rgba(255, 255, 255, 0.8)",
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginVertical: Spacing.xs,
  },
  summaryChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    ...TextStyles.caption,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: Spacing.xxs,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  budgetText: {
    ...TextStyles.bodySmall,
    color: "rgba(255,255,255,0.7)",
  },
  budgetPercent: {
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
  periodSelector: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.md,
  },
  periodButtonActive: {
    ...Shadows.sm,
  },
  periodText: {
    ...TextStyles.labelMedium,
  },
  chartCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  chartTitle: {
    ...TextStyles.labelLarge,
    marginBottom: Spacing.md,
  },
  chart: {
    borderRadius: BorderRadius.lg,
    marginLeft: -Spacing.sm,
  },
  categoryList: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    ...TextStyles.labelLarge,
    marginBottom: Spacing.md,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  categoryName: {
    ...TextStyles.bodyMedium,
  },
  categoryAmount: {
    ...TextStyles.labelMedium,
  },
  // Budget styles
  budgetCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  budgetHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  budgetInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  budgetName: {
    ...TextStyles.labelMedium,
    fontWeight: "600",
  },
  budgetAmount: {
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
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  infoText: {
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

export default StatsScreen;
