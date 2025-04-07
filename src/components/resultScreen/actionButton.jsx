// components/ActionButtons.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

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

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.BLACK,
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    width: "60%",
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ActionButtons;
