//import liraries
import React, { Component, useState } from "react";
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
import { addTransaction } from "../store/walletSlice";
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

  const isPhoneNumverValid = (number) => /^[0-9]{10}$/.test(number);

  const handleSubmit = () => {
    if (!isPhoneNumverValid(phoneNumber)) {
      Alert.alert("Hata", "Geçersiz telefon numarası");
      return;
    }
    if (parseFloat(amount) < MIN_AMOUNT) {
      Alert.alert("Hata", `Minimum Transfer Tutari ${MIN_AMOUNT} olmalidir.`);
      return;
    }
    if (parseFloat(amount) > balance) {
      Alert.alert("Hata", "Bakiye yetersiz.");
      return;
    }
    setConfirmData({ phoneNumber, amount: parseFloat(amount), description });
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    dispatch(
      addTransaction({
        receiver: confirmData.phoneNumber,
        amount: confirmData.amount,
      })
    );
    Alert.alert("Basarili", "Transfer islemi basariyla Gerceklesti");

    setIsModalVisible(false);
    navigation.navigate("ResultScreen");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: Colors.PRIMARY }} // ScrollView'ın arka planını ayarladık
    >
      <View style={styles.container}>
        <Text style={styles.title}>Transfer Ekrani</Text>

        <CustomTextInput
          placeholder="Telefon Numarasi"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <CustomTextInput
          placeholder="Miktar"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <CustomTextInput
          placeholder="Miktar"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <CustomTextInput
          style={styles.input}
          placeholder="Açıklama "
          value={description}
          onChangeText={setDescription}
        />

        <CustomButton title="Devam" style={{ backgroundColor: Colors.BLACK }} />

        <View style={styles.balanceContainer}>
          <Text>Bakiye: {balance}</Text>
        </View>

        {/* MODAL */}

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}></View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default TransferScreen;
