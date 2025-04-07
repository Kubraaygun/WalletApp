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

        <CustomButton
          title="Devam"
          onPress={handleSubmit}
          style={{ backgroundColor: Colors.BLACK }}
        />

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTextContainer}>Bakiye: {balance} TL</Text>
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
              <Text style={styles.modalText}>
                Alici : {confirmData?.phoneNumber}
              </Text>
              <Text style={styles.modalText}>
                Miktar : {confirmData?.amount} TL
              </Text>
              {confirmData?.description && (
                <Text style={styles.modalText}>
                  Aciklama:{confirmData?.description}
                </Text>
              )}

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonText}>Onayla</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Iptal</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  balanceContainer: {
    fontWeight: "bold",
    marginTop: 20,
  },
  balanceTextContainer: {
    fontWeight: "bold",
    fontSize: 18,
    backgroundColor: Colors.BASEGRAY,
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
  },
  modalButton: {
    backgroundColor: Colors.BLACK,
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});

//make this component available to the app
export default TransferScreen;
