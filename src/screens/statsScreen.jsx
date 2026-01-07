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
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const { width } = Dimensions.get("window");

const StatsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const periods = [
    { id: "week", label: "Hafta" },
    { id: "month", label: "Ay" },
    { id: "year", label: "Yil" },
  ];

  const spendingData = {
    week: [850, 1200, 450, 2100, 1800, 950, 1500],
    month: [4500, 5200, 3800, 6100, 4800, 5500, 4200, 3900, 5800, 4100, 5300, 4700],
    year: [45000, 52000, 48000, 61000, 55000, 58000, 62000, 54000, 49000, 53000, 57000, 51000],
  };

  const categoryData = [
    { name: "Market", amount: 3500, color: colors.PRIMARY },
    { name: "Ulasim", amount: 1200, color: colors.SECONDARY },
    { name: "Yemek", amount: 2800, color: "#FF9500" },
    { name: "Eglence", amount: 1500, color: colors.SUCCESS },
    { name: "Diger", amount: 1000, color: colors.GRAY_500 },
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
      ? ["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"]
      : selectedPeriod === "month"
      ? ["1", "5", "10", "15", "20", "25", "30"]
      : ["Oca", "Sub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Eki", "Kas", "Ara"],
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Harcama Istatistikleri</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <FadeSlide delay={0}>
          <View style={[styles.summaryCard, { backgroundColor: colors.PRIMARY }]}>
            <Text style={styles.summaryLabel}>Bu Ay Toplam Harcama</Text>
            <Text style={styles.summaryAmount}>₺{totalSpending.toLocaleString("tr-TR")}</Text>
            <View style={styles.summaryChange}>
              <Icon name="trending-down" size={14} color={colors.SUCCESS} />
              <Text style={styles.changeText}>Gecen aya gore %12 daha az</Text>
            </View>
          </View>
        </FadeSlide>

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
            <Text style={[styles.chartTitle, { color: colors.TEXT_PRIMARY }]}>Kategori Dagilimi</Text>
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
                <Text style={[styles.categoryAmount, { color: colors.TEXT_PRIMARY }]}>₺{category.amount.toLocaleString("tr-TR")}</Text>
              </View>
            ))}
          </View>
        </FadeSlide>
      </ScrollView>
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
    ...TextStyles.displayLarge,
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
});

export default StatsScreen;
