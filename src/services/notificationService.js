import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Expo Go'da çalışıp çalışmadığını kontrol et
const isExpoGo = Constants.appOwnership === "expo";

// Notifications modülünü lazy load et (Expo Go'da import etme)
let Notifications = null;

const getNotifications = async () => {
  if (isExpoGo) return null;
  if (Notifications) return Notifications;
  
  try {
    Notifications = await import("expo-notifications");
    return Notifications;
  } catch (error) {
    console.log("expo-notifications yüklenemedi");
    return null;
  }
};

// Notification handler'ı sadece development build'de kur
if (!isExpoGo) {
  getNotifications().then((notif) => {
    if (notif) {
      try {
        notif.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
      } catch (error) {
        console.log("Notification handler kurulamadı");
      }
    }
  });
}

/**
 * Push notification izni iste ve token al
 * @returns {Promise<string|null>} Expo Push Token veya null
 */
export const registerForPushNotifications = async () => {
  // Expo Go'da push notifications desteklenmiyor
  if (isExpoGo) {
    console.log("Push notifications Expo Go'da desteklenmiyor");
    return null;
  }

  const notif = await getNotifications();
  if (!notif) return null;

  let token = null;

  // Fiziksel cihaz kontrolü
  if (!Device.isDevice) {
    console.log("Push notifications sadece fiziksel cihazlarda çalışır");
    return null;
  }

  try {
    // Mevcut izin durumunu kontrol et
    const { status: existingStatus } = await notif.getPermissionsAsync();
    let finalStatus = existingStatus;

    // İzin yoksa iste
    if (existingStatus !== "granted") {
      const { status } = await notif.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification izni verilmedi");
      return null;
    }

    // Expo Push Token al
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    token = (
      await notif.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    // Android için notification channel oluştur
    if (Platform.OS === "android") {
      await notif.setNotificationChannelAsync("default", {
        name: "Varsayılan",
        importance: notif.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#4F46E5",
      });

      await notif.setNotificationChannelAsync("transactions", {
        name: "İşlem Bildirimleri",
        importance: notif.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#10B981",
      });
    }
  } catch (error) {
    console.log("Push token alınamadı:", error.message);
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
  // Expo Go'da desteklenmiyor
  if (isExpoGo) {
    console.log("Local notification (Expo Go):", title);
    return;
  }

  const notif = await getNotifications();
  if (!notif) return;

  try {
    await notif.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Hemen gönder
    });
  } catch (error) {
    console.log("Bildirim gönderilemedi:", error.message);
  }
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
  // Expo Go'da desteklenmiyor
  if (isExpoGo) {
    return () => {}; // Boş cleanup fonksiyonu
  }

  // Async olarak listener'ları kur
  let receivedSubscription = null;
  let responseSubscription = null;

  getNotifications().then((notif) => {
    if (notif) {
      try {
        receivedSubscription = notif.addNotificationReceivedListener(
          onNotificationReceived
        );
        responseSubscription = notif.addNotificationResponseReceivedListener(
          onNotificationResponse
        );
      } catch (error) {
        console.log("Notification listeners kurulamadı:", error.message);
      }
    }
  });

  return () => {
    if (receivedSubscription) receivedSubscription.remove();
    if (responseSubscription) responseSubscription.remove();
  };
};

/**
 * Badge sayısını güncelle
 */
export const setBadgeCount = async (count) => {
  if (isExpoGo) return;
  
  const notif = await getNotifications();
  if (!notif) return;
  
  try {
    await notif.setBadgeCountAsync(count);
  } catch (error) {
    console.log("Badge güncellenemedi:", error.message);
  }
};

/**
 * Tüm bildirimleri temizle
 */
export const clearAllNotifications = async () => {
  if (isExpoGo) return;
  
  const notif = await getNotifications();
  if (!notif) return;
  
  try {
    await notif.dismissAllNotificationsAsync();
    await setBadgeCount(0);
  } catch (error) {
    console.log("Bildirimler temizlenemedi:", error.message);
  }
};
