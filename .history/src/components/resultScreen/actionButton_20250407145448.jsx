// components/ActionButtons.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import styles from "../../styles/components/resultScreen/actionButtonStyles";

const ActionButtons = ({ success, navigation }) => {
  return (
    <>
      {success ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.retryButton]}
          onPress={() => navigation.navigate("TransferScreen")}
        >
          <Text style={styles.buttonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ActionButtons;
