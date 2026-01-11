import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../utils/spacing";
import { Shadows } from "../utils/shadows";

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "transfer_received",
    title: "Para Transferi Alındı",
    message: "Ahmet Yılmaz size ₺500,00 gönderdi",
    time: "2 dakika önce",
    read: false,
    icon: "download",
    color: "#4ADE80",
  },
  {
    id: "2",
    type: "transfer_sent",
    title: "Transfer Başarılı",
    message: "Ayşe Kaya'ya ₺150,00 gönderildi",
    time: "1 saat önce",
    read: false,
    icon: "send",
    color: "#3B82F6",
  },
  {
    id: "3",
    type: "promo",
    title: "Özel Kampanya",
    message: "İlk transfer işleminizde %10 bonus kazanın!",
    time: "3 saat önce",
    read: true,
    icon: "gift",
    color: "#F59E0B",
  },
  {
    id: "4",
    type: "security",
    title: "Güvenlik Uyarısı",
    message: "Yeni cihazdan giriş yapıldı",
    time: "Dün",
    read: true,
    icon: "shield",
    color: "#EF4444",
  },
  {
    id: "5",
    type: "card",
    title: "Kart İşlemi",
    message: "Alışveriş Kartınız aktifleştirildi",
    time: "Dün",
    read: true,
    icon: "credit-card",
    color: "#8B5CF6",
  },
  {
    id: "6",
    type: "transfer_received",
    title: "Para Transferi Alındı",
    message: "Mehmet Demir size ₺1.250,00 gönderdi",
    time: "2 gün önce",
    read: true,
    icon: "download",
    color: "#4ADE80",
  },
  {
    id: "7",
    type: "system",
    title: "Uygulama Güncellendi",
    message: "WalletApp v2.0 yeni özelliklerle güncellendi",
    time: "3 gün önce",
    read: true,
    icon: "info",
    color: "#06B6D4",
  },
];

const NotificationItem = ({ item, index, onPress, onMarkAsRead, colors }) => {
  return (
    <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { backgroundColor: item.read ? colors.SURFACE : `${colors.PRIMARY}08` },
        ]}
        onPress={() => onPress(item)}
        activeOpacity={0.7}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <Icon name={item.icon} size={20} color={item.color} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text 
              style={[
                styles.title, 
                { color: colors.TEXT_PRIMARY },
                !item.read && styles.unreadTitle
              ]}
            >
              {item.title}
            </Text>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.PRIMARY }]} />}
          </View>
          <Text 
            style={[styles.message, { color: colors.TEXT_SECONDARY }]}
            numberOfLines={2}
          >
            {item.message}
          </Text>
          <Text style={[styles.time, { color: colors.GRAY_400 }]}>{item.time}</Text>
        </View>

        {/* Action */}
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => onMarkAsRead(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="more-vertical" size={18} color={colors.GRAY_400} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNotificationPress = (notification) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    // TODO: Navigate based on notification type
  };

  const handleMarkAsRead = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setNotifications([]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {unreadCount > 0 && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: `${colors.PRIMARY}15` }]}
          onPress={handleMarkAllAsRead}
        >
          <Icon name="check-circle" size={16} color={colors.PRIMARY} />
          <Text style={[styles.actionButtonText, { color: colors.PRIMARY }]}>
            Tümünü Okundu İşaretle
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.SURFACE }]}>
        <Icon name="bell-off" size={48} color={colors.GRAY_400} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.TEXT_PRIMARY }]}>
        Bildirim Yok
      </Text>
      <Text style={[styles.emptyMessage, { color: colors.TEXT_SECONDARY }]}>
        Yeni bildirimleriniz burada görünecek
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={IconSize.md} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>Bildirimler</Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.PRIMARY }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Icon name="trash-2" size={20} color={colors.ERROR} />
          </TouchableOpacity>
        )}
        {notifications.length === 0 && <View style={styles.headerSpacer} />}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={({ item, index }) => (
          <NotificationItem
            item={item}
            index={index}
            onPress={handleNotificationPress}
            onMarkAsRead={handleMarkAsRead}
            colors={colors}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyListContent
        ]}
        ListHeaderComponent={notifications.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.PRIMARY}
            colors={[colors.PRIMARY]}
          />
        }
      />
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
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    ...TextStyles.h3,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.xs,
    paddingHorizontal: 6,
  },
  badgeText: {
    ...TextStyles.caption,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  clearButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 44,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  emptyListContent: {
    flex: 1,
  },
  listHeader: {
    marginBottom: Spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  actionButtonText: {
    ...TextStyles.labelMedium,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
    marginRight: Spacing.xs,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    ...TextStyles.labelMedium,
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.xs,
  },
  message: {
    ...TextStyles.bodySmall,
    marginBottom: 4,
  },
  time: {
    ...TextStyles.caption,
  },
  moreButton: {
    padding: Spacing.xxs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...TextStyles.h4,
    marginBottom: Spacing.xs,
  },
  emptyMessage: {
    ...TextStyles.bodyMedium,
    textAlign: "center",
  },
});

export default NotificationsScreen;
