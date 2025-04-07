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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  title: {
    fontSize: 24,
    marginBottom: 80,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  balanceContainer: {
    fontWeight: "bold",
    marginTop: 20,
  },
  balanceTextContainer: {
    fontWeight: "bold",
    fontSize: 18,
  },

  //Modal Style
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: Colors.BLACK,
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    width: 80,
    height: 80,
    marginTop: 100, // s
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconStyleUser: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
});

export default TransferScreen;
