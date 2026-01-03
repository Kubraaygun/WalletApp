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
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";
import { FadeSlide } from "../components/animations";

const { width } = Dimensions.get("window");

const StatsScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const periods = [
    { id: "week", label: "Hafta" },
    { id: "month", label: "Ay" },
    { id: "year", label: "Yıl" },
  ];

  // Mock harcama verileri
  const spendingData = {
    week: [850, 1200, 450, 2100, 1800, 950, 1500],
    month: [4500, 5200, 3800, 6100, 4800, 5500, 4200, 3900, 5800, 4100, 5300, 4700],
    year: [45000, 52000, 48000, 61000, 55000, 58000, 62000, 54000, 49000, 53000, 57000, 51000],
  };

  const categoryData = [
    { name: "Market", amount: 3500, color: Colors.PRIMARY, legendFontColor: Colors.TEXT_PRIMARY },
    { name: "Ulaşım", amount: 1200, color: Colors.SECONDARY, legendFontColor: Colors.TEXT_PRIMARY },
    { name: "Yemek", amount: 2800, color: "#FF9500", legendFontColor: Colors.TEXT_PRIMARY },
    { name: "Eğlence", amount: 1500, color: Colors.SUCCESS, legendFontColor: Colors.TEXT_PRIMARY },
    { name: "Diğer", amount: 1000, color: Colors.GRAY_500, legendFontColor: Colors.TEXT_PRIMARY },
  ];

  const pieChartData = categoryData.map((item) => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: item.legendFontColor,
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
        color: () => Colors.PRIMARY,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.CARD,
    backgroundGradientFrom: Colors.CARD,
    backgroundGradientTo: Colors.CARD,
    decimalPlaces: 0,
    color: () => Colors.PRIMARY,
    labelColor: () => Colors.TEXT_SECONDARY,
    style: {
      borderRadius: BorderRadius.lg,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: Colors.PRIMARY,
    },
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const totalSpending = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Harcama İstatistikleri</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <FadeSlide delay={0}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Bu Ay Toplam Harcama</Text>
            <Text style={styles.summaryAmount}>₺{totalSpending.toLocaleString("tr-TR")}</Text>
            <View style={styles.summaryChange}>
              <Icon name="trending-down" size={14} color={Colors.SUCCESS} />
              <Text style={styles.changeText}>Geçen aya göre %12 daha az</Text>
            </View>
          </View>
        </FadeSlide>

        {/* Period Selector */}
        <FadeSlide delay={100}>
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.id && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period.id && styles.periodTextActive,
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
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Harcama Trendi</Text>
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
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Kategori Dağılımı</Text>
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
          <View style={styles.categoryList}>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            {categoryData.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>₺{category.amount.toLocaleString("tr-TR")}</Text>
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
    backgroundColor: Colors.PRIMARY,
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
    color: Colors.WHITE,
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
    backgroundColor: Colors.SURFACE,
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
    backgroundColor: Colors.CARD,
    ...Shadows.sm,
  },
  periodText: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
  },
  periodTextActive: {
    color: Colors.PRIMARY,
  },
  chartCard: {
    backgroundColor: Colors.CARD,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  chartTitle: {
    ...TextStyles.labelLarge,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.md,
  },
  chart: {
    borderRadius: BorderRadius.lg,
    marginLeft: -Spacing.sm,
  },
  categoryList: {
    backgroundColor: Colors.CARD,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    ...TextStyles.labelLarge,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.md,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
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
    color: Colors.TEXT_PRIMARY,
  },
  categoryAmount: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_PRIMARY,
  },
});

export default StatsScreen;
