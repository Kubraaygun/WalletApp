import apiClient from "./apiClient";

/**
 * Cüzdan bakiyesini getir
 */
export const getBalance = async () => {
  const response = await apiClient.get("/wallet/balance");
  return response.data;
};

/**
 * İşlem geçmişini getir
 * @param {object} params - Sayfalama parametreleri
 */
export const getTransactions = async (params = { page: 1, limit: 20 }) => {
  const response = await apiClient.get("/wallet/transactions", { params });
  return response.data;
};

/**
 * Para transferi yap
 * @param {object} transferData - Transfer bilgileri
 */
export const transfer = async (transferData) => {
  const { recipientId, amount, description } = transferData;
  const response = await apiClient.post("/wallet/transfer", {
    recipientId,
    amount,
    description,
  });
  return response.data;
};

/**
 * Kullanıcı ara (transfer için)
 * @param {string} query - Telefon, email veya isim
 */
export const searchRecipient = async (query) => {
  const response = await apiClient.get("/wallet/search-recipient", {
    params: { query },
  });
  return response.data;
};

/**
 * QR kod ile ödeme bilgilerini çöz
 * @param {string} qrData - QR koddan okunan data
 */
export const parseQRPayment = async (qrData) => {
  const response = await apiClient.post("/wallet/parse-qr", { qrData });
  return response.data;
};

/**
 * Tek bir işlemin detaylarını getir
 * @param {string} transactionId - İşlem ID'si
 */
export const getTransactionDetail = async (transactionId) => {
  const response = await apiClient.get(`/wallet/transactions/${transactionId}`);
  return response.data;
};
