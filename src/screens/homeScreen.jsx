import React, { useState, useCallback } from "react";
import { View, ScrollView, StatusBar, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { walletStart, walletSuccess, walletFailure } from "../store/walletSlice";
import { logout } from "../store/authSlice";
import { walletService } from "../services";
import { useTheme } from "../contexts/ThemeContext";
import { Spacing } from "../utils/spacing";

// Components
import HomeHeader from "../components/homeScreen/homeHeader";
import BalanceCard from "../components/homeScreen/balanceCard";
import QuickActions from "../components/homeScreen/quickActions";
import TransactionList from "../components/homeScreen/transactionList";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance, transactions, isLoading } = useSelector((state) => state.wallet);
  const { user } = useSelector((state) => state.auth);
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const contentScale = useSharedValue(1);
  const contentOpacity = useSharedValue(1);

  const fetchWalletData = async () => {
    try {
      dispatch(walletStart());
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      dispatch(walletSuccess({ balance, transactions }));
    } catch (error) {
      dispatch(walletFailure(error.message));
    }
  };

  const triggerRefreshAnimation = () => {
    // Scale down and fade slightly
    contentScale.value = withSequence(
      withTiming(0.98, { duration: 150 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    contentOpacity.value = withSequence(
      withTiming(0.7, { duration: 150 }),
      withSpring(1)
    );
  };

  const onRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRefreshing(true);
    triggerRefreshAnimation();
    await fetchWalletData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setRefreshing(false);
  }, [balance, transactions]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  const handleProfilePress = () => {
    navigation.navigate("ProfileScreen");
  };

  const handleNotificationPress = () => {
    navigation.navigate("NotificationsScreen");
  };

  // Animated content style
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: contentScale.value }],
    opacity: contentOpacity.value,
  }));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.BACKGROUND} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor={colors.ACCENT}
            colors={[colors.ACCENT, colors.PRIMARY]}
            progressBackgroundColor={colors.SURFACE}
            title="Yenileniyor..."
            titleColor={colors.TEXT_SECONDARY}
          />
        }
      >
        <Animated.View style={animatedContentStyle}>
          {/* Header */}
          <HomeHeader
            userName={user?.name || "Kullanici"}
            onNotificationPress={handleNotificationPress}
            onProfilePress={handleProfilePress}
          />

          {/* Balance Card */}
          <BalanceCard balance={balance} />

          {/* Quick Actions */}
          <QuickActions navigation={navigation} />

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            onSeeAll={() => { }}
            maxItems={5}
          />

          {/* Bottom spacer for scroll */}
          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing["2xl"],
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

export default HomeScreen;
