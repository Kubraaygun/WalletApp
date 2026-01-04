// PhoneValidationComponent.js
import { Alert } from "react-native";

// Telefon numarasını temizleyen fonksiyon (boşluk, tire, parantez kaldır)
const cleanPhoneNumber = (number) => {
  return number.replace(/[\s\-\(\)]/g, "");
};

// Telefon numarasını kontrol eden fonksiyon
const isPhoneNumberValid = (number) => {
  const cleanedNumber = cleanPhoneNumber(number);
  
  if (cleanedNumber.length === 0) {
    return "Telefon numarası boş olamaz";
  } else if (cleanedNumber.length < 10) {
    return "Telefon numarası eksik, en az 10 haneli olmalı";
  } else if (cleanedNumber.length > 11) {
    return "Telefon numarası fazla uzun";
  } else if (!/^[0-9]+$/.test(cleanedNumber)) {
    return "Telefon numarası sadece rakam içermeli";
  }
  
  // 10 haneli ise başında 5 olmalı (5XX XXX XX XX formatı)
  if (cleanedNumber.length === 10 && cleanedNumber[0] !== "5") {
    return "10 haneli numara 5 ile başlamalı";
  }
  
  // 11 haneli ise başında 0 olmalı (0XXX XXX XX XX formatı)
  if (cleanedNumber.length === 11 && cleanedNumber[0] !== "0") {
    return "11 haneli numara 0 ile başlamalı";
  }
  
  return true; // Geçerli telefon numarası
};

// Telefon numarasını doğrulayan bileşen
const PhoneValidationComponent = ({ phoneNumber }) => {
  const validationMessage = isPhoneNumberValid(phoneNumber);

  if (validationMessage !== true) {
    Alert.alert("Hata", validationMessage);
    return false;
  }

  return true;
};

export default PhoneValidationComponent;
