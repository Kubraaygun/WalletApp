import React from "react";
import { View, ScrollView, SafeAreaView, StatusBar, StyleSheet, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
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
  const [refreshing, setRefreshing] = React.useState(false);

  // API'den wallet verilerini çek
  const fetchWalletData = async () => {
    try {
      dispatch(walletStart());
      dispatch(walletSuccess({ balance, transactions }));
    } catch (error) {
      dispatch(walletFailure(error.message));
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchWalletData();
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
    // TODO: Bildirimler ekranına yönlendir
  };

  const dynamicStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.BACKGROUND,
    },
  };

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
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
            colors={[colors.ACCENT]}
          />
        }
      >
        {/* Header */}
        <HomeHeader
          userName={user?.name || "Kullanıcı"}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
