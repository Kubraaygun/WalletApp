// PhoneValidationComponent.js
import React from "react";
import { Alert } from "react-native";

// Telefon numarasını kontrol eden fonksiyon
const isPhoneNumberValid = (number) => {
  // Başında '0' olmalı ve toplamda 10 haneli olmalı
  if (number.length === 0) {
    return "Telefon numarası boş olamaz"; // Boş girildiğinde
  } else if (number.length < 12) {
    return "Telefon numarası eksik, 11 haneli olmalı"; // Eksik numara
  } else if (number.length > 11) {
    return "Telefon numarası fazla, 11 haneli olmalı"; // Fazla haneli numara
  } else if (!/^[0-9]{10}$/.test(number)) {
    return "Telefon numarası geçersiz, sadece rakam olmalı"; // Geçersiz format
  } else if (number[0] !== "0") {
    return "Telefon numarası 0 ile başlamalı"; // Başında '0' olmamalı
  }
  return true; // Geçerli telefon numarası
};

// Telefon numarasını doğrulayan bileşen
const PhoneValidationComponent = ({ phoneNumber }) => {
  const validationMessage = isPhoneNumberValid(phoneNumber);

  if (validationMessage !== true) {
    Alert.alert("Hata", validationMessage);
    return false; // Hata var, geçersiz numara
  }

  return true; // Geçerli numara
};

export default PhoneValidationComponent;
