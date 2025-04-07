import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/components/transferScreen/transferModalStyles";

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

export default TransferModal;
