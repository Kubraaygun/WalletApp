// components/LoadingModal.js
import { ActivityIndicator, Modal, View } from "react-native";
import { useSelector } from "react-redux";

const LoadingModal = () => {
  const loading = useSelector((state) => state.loading);

  return (
    <Modal visible={loading} transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000088",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

export default LoadingModal;
