import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

const TransferModal = ({
  visible,
  confirmData,
  handleConfirm,
  handleCancel,
}) => (
  <Modal visible={visible} transparent={true} animationType="slide">
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
          <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
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
);

const styles = StyleSheet.create({
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
});

export default TransferModal;
