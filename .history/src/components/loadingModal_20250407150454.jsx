// components/LoadingModal.js
import { ActivityIndicator, Modal, View } from "react-native";
import { useSelector } from "react-redux";
import styles from "../styles/components/loadingModalStyles";
const LoadingModal = () => {
  const loading = useSelector((state) => state.loading);

  return (
    <Modal visible={loading} transparent>
      <View style={styles.loadingStyle}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

export default LoadingModal;
