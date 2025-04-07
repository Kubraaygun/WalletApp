import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "../store/walletSlice";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";

const TransferScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.wallet);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  const MIN_AMOUNT = 10;

  const handleSubmit = () => {
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
        <TransferInputs
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          amount={amount}
          setAmount={setAmount}
          description={description}
          setDescription={setDescription}
        />

        <BalanceDisplay balance={balance} />

        <CustomButton
          title="Devam"
          onPress={handleSubmit}
          style={{ backgroundColor: Colors.BLACK, marginTop: 20 }}
        />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
});

export default TransferScreen;
