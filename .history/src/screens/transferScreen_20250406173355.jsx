import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, setBalance } from "../store/walletSlice";
import CustomTextInput from "../components/customTextInput";
import { Colors } from "../utils/colors";
import CustomButton from "../components/customButton";
import PhoneValidationComponent from "../components/isPhoneNumberValid";

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
    // Telefon numarasını doğrula
    const isPhoneValid = PhoneValidationComponent({ phoneNumber });
    if (!isPhoneValid) {
      return; // Telefon numarası geçersizse işlemi durdur
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
      <Image
        source={require("../assets/images/transfer.png")}
        style={styles.icon}
      />
      <View style={styles.container}>
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
          style={{ backgroundColor: Colors.BLACK }}
        />

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTextContainer}>
            Bakiye:{" "}
            {parseFloat(balance).toLocaleString("tr-TR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
            TL
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
              <Text style={styles.modalText}>
                Alıcı: {confirmData?.phoneNumber || "Telefon numarası yok"}
              </Text>
              <Text style={styles.modalText}>
                Miktar:{" "}
                {parseFloat(confirmData?.amount).toLocaleString("tr-TR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
                TL
              </Text>
              {confirmData?.description && (
                <Text style={styles.modalText}>
                  Açıklama: {confirmData?.description}
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
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>İptal</Text>
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
    position: "relative",
  },
  title: {
    fontSize: 24,
    marginBottom: 80,
    fontWeight: "bold",
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
    backgroundColor: "#D32F2F", // Kırmızı renk iptal butonu için
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    position: "absolute", // Resmi kesinlikle başlık üzerine yerleştiriyoruz
    // Başlığın hemen üstüne yerleştirmek için
    alignSelf: "center", // Yatayda ortalıyoruz
    width: 80, // Resim boyutunu istediğiniz gibi ayarlayabilirsiniz
    height: 100, // Resim boyutunu istediğiniz gibi ayarlayabilirsiniz
    marginBottom: -50, // Başlık ve resim arasındaki boşluğu ayarlayabilirsiniz
  },
});

export default TransferScreen;
