import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "../store/walletSlice";
import CustomTextInput from "../components/customTextInput";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";
import PhoneValidationComponent from "../components/isPhoneNumberValid";
import BalanceDisplay from "../components/transferScreen/balancaDisplay";
import TransferModal from "../components/transferScreen/transferModal";
import styles from "../styles/screens/transferScreenStyles";
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
  // Handle form submission
  const handleSubmit = () => {
    const isPhoneValid = PhoneValidationComponent({ phoneNumber });
    if (!isPhoneValid) {
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount < MIN_AMOUNT) {
      Alert.alert(
        "Hata",
        `Minimum Transfer Tutarı ${MIN_AMOUNT} TL olmalıdır.`
      );
      return;
    }

    if (parsedAmount > balance) {
      Alert.alert("Hata", "Bakiye yetersiz.");
      return;
    }

    setConfirmData({
      phoneNumber,
      amount: parsedAmount,
      description,
    });
    setIsModalVisible(true);
  };
  // Handle confirmation
  const handleConfirm = () => {
    try {
      dispatch(
        addTransaction({
          receiver: confirmData.phoneNumber,
          amount: confirmData.amount,
        })
      );

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
        <View style={styles.imageWrapper}>
          <Image
            source={require("../assets/images/transfer.png")}
            style={styles.iconStyleUser}
          />
        </View>
        <Text style={styles.title}>Transfer </Text>

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
          style={{ backgroundColor: Colors.BLACK, marginTop: 20 }}
        />

        <BalanceDisplay balance={balance} />

        <TransferModal
          visible={isModalVisible}
          confirmData={confirmData}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      </View>
    </ScrollView>
  );
};

export default TransferScreen;
