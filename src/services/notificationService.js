import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Notification handler yapılandırması
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Push notification izni iste ve token al
 * @returns {Promise<string|null>} Expo Push Token veya null
 */
export const registerForPushNotifications = async () => {
  let token = null;

  // Fiziksel cihaz kontrolü
  if (!Device.isDevice) {
    console.warn("Push notifications sadece fiziksel cihazlarda çalışır");
    return null;
  }

  // Mevcut izin durumunu kontrol et
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // İzin yoksa iste
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notification izni verilmedi");
    return null;
  }

  // Expo Push Token al
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
  } catch (error) {
    console.error("Push token alınamadı:", error);
  }

  // Android için notification channel oluştur
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Varsayılan",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4F46E5",
    });

    await Notifications.setNotificationChannelAsync("transactions", {
      name: "İşlem Bildirimleri",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#10B981",
    });
  }

  return token;
};

/**
 * Yerel bildirim gönder
 */
export const sendLocalNotification = async ({
  title,
  body,
  data = {},
  channelId = "default",
}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // Hemen gönder
  });
};

/**
 * Transfer başarılı bildirimi
 */
export const sendTransferSuccessNotification = async (amount, recipient) => {
  await sendLocalNotification({
    title: "Transfer Başarılı ✅",
    body: `₺${amount} tutarında ${recipient} kişisine transfer yapıldı.`,
    data: { type: "transfer_success" },
    channelId: "transactions",
  });
};

/**
 * Para geldi bildirimi
 */
export const sendMoneyReceivedNotification = async (amount, sender) => {
  await sendLocalNotification({
    title: "Para Geldi! 💰",
    body: `${sender} size ₺${amount} gönderdi.`,
    data: { type: "money_received" },
    channelId: "transactions",
  });
};

/**
 * Notification listener'ları kur
 * @param {function} onNotificationReceived - Bildirim alındığında
 * @param {function} onNotificationResponse - Bildirime tıklandığında
 */
export const setupNotificationListeners = (
  onNotificationReceived,
  onNotificationResponse
) => {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    onNotificationReceived
  );

  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener(
      onNotificationResponse
    );

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
};

/**
 * Badge sayısını güncelle
 */
export const setBadgeCount = async (count) => {
  await Notifications.setBadgeCountAsync(count);
};

/**
 * Tüm bildirimleri temizle
 */
export const clearAllNotifications = async () => {
  await Notifications.dismissAllNotificationsAsync();
  await setBadgeCount(0);
};
