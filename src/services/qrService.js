import { Camera } from "expo-camera";

/**
 * Kamera izni iste
 */
export const requestCameraPermission = async () => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Kamera izni hatası:", error);
    return false;
  }
};

/**
 * Kamera izni durumunu kontrol et
 */
export const getCameraPermissionStatus = async () => {
  try {
    const { status } = await Camera.getCameraPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Kamera izin kontrolü hatası:", error);
    return false;
  }
};

/**
 * QR kod verisini parse et ve transfer bilgilerini çıkar
 * @param {string} qrData - QR koddan okunan ham veri
 * @returns {object|null} Parse edilmiş transfer bilgileri veya null
 */
export const parseQRPaymentData = (qrData) => {
  try {
    // WalletApp QR formatı: walletapp://pay?to=PHONE&amount=AMOUNT&desc=DESCRIPTION
    if (qrData.startsWith("walletapp://pay")) {
      const url = new URL(qrData);
      const params = url.searchParams;
      
      return {
        type: "payment",
        recipient: params.get("to"),
        amount: parseFloat(params.get("amount")) || null,
        description: params.get("desc") || "",
        isValid: !!params.get("to"),
      };
    }

    // JSON formatı desteği
    if (qrData.startsWith("{")) {
      const data = JSON.parse(qrData);
      return {
        type: data.type || "payment",
        recipient: data.recipient || data.to || data.phone,
        amount: parseFloat(data.amount) || null,
        description: data.description || data.desc || "",
        isValid: !!(data.recipient || data.to || data.phone),
      };
    }

    // Sadece telefon numarası
    const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
    if (phoneRegex.test(qrData.replace(/\s/g, ""))) {
      return {
        type: "contact",
        recipient: qrData.replace(/\s/g, ""),
        amount: null,
        description: "",
        isValid: true,
      };
    }

    return null;
  } catch (error) {
    console.error("QR parse hatası:", error);
    return null;
  }
};

/**
 * QR kod verisi oluştur (kendi QR kodunu paylaşmak için)
 * @param {string} phone - Telefon numarası
 * @param {number} amount - Tutar (opsiyonel)
 * @param {string} description - Açıklama (opsiyonel)
 */
export const generateQRPaymentData = (phone, amount = null, description = "") => {
  let url = `walletapp://pay?to=${encodeURIComponent(phone)}`;
  
  if (amount) {
    url += `&amount=${amount}`;
  }
  
  if (description) {
    url += `&desc=${encodeURIComponent(description)}`;
  }
  
  return url;
};
