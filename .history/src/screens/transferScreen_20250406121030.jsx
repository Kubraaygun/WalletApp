import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, setBalance } from "../store/walletSlice";
import CustomTextInput from "../components/customTextInput";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";

// create a component
const TransferScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.wallet);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  const MIN_AMOUNT = 10;

  const isPhoneNumberValid = (number) => /^[0-9]{10}$/.test(number);

  const handleSubmit = () => {
    // Parse amount once and reuse the parsed value
    const parsedAmount = parseFloat(amount);
    
    if (!isPhoneNumberValid(phoneNumber)) {
      Alert.alert("Hata", "Geçersiz telefon numarası");
      return;
    }
    
    if (isNaN(parsedAmount) || parsedAmount < MIN_AMOUNT) {
      Alert.alert("Hata", `Minimum Transfer Tutarı ${MIN_AMOUNT} TL olmalıdır.`);
      return;
    }
    
    if (parsedAmount > balance) {
      Alert.alert("Hata", "Bakiye yetersiz.");
      return;
    }
    
    setConfirmData({ 
      phoneNumber, 
      amount: parsedAmount, 
      description 
    });
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    try {
      // Transfer işlemi yap
      dispatch(
        addTransaction({
          receiver: confirmData.phoneNumber,
          amount: confirmData.amount,
        })
      );
      
      // Modal'ı kapat ve sonuç ekranına yönlendir
      setIsModalVisible(false);
      navigation.navigate("ResultScreen", {
        success: true,
        phoneNumber: confirmData.phoneNumber,
        amount: confirmData.amount,
        description: confirmData.description,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Transfer işlemi hatası:", error);
      Alert.alert("Hata", "İşlem sırasında bir hata oluştu.");
    }
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: Colors.PRIMARY }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Transfer Ekranı</Text>

        <CustomTextInput
          placeholder="Telefon Numarası"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <CustomTextInput
          placeholder="Miktar (TL)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <CustomTextInput
          style={styles.input}
          placeholder="Açıklama"
          value={description}
          onChangeText={setDescription}
        />

        <CustomButton
          title="Devam"
          onPress={handleSubmit}
          style={{ backgroundColor: Colors.BLACK }}
        />

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTextContainer}>
            Bakiye: {balance.toFixed(2)} TL
          </Text>
        </View>

        {/* MODAL */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Transfer Onayla</Text>
              <Text style={styles.modalText