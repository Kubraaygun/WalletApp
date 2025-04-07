// components/ResultInfo.js
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

const ResultInfo = ({
  formattedAmount,
  phoneNumber,
  description,
  formattedDate,
  formattedTime,
}) => {
  return (
    <View
      style={{
        padding: 20,
        alignItems: "center",
        width: "90%",
        borderWidth: 1,
        backgroundColor: Colors.LIGHT,
        borderColor: Colors.LIGHTGRAY,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <Text style={styles.info}>Tutar: {formattedAmount} TL</Text>
      <Text style={styles.info}>Alıcı: {phoneNumber}</Text>
      {description && <Text style={styles.info}>{description}</Text>}
      <Text style={styles.info}>Tarih: {formattedDate}</Text>
      <Text style={styles.info}>Saat: {formattedTime}</Text>
    </View>
  );
};

export default ResultInfo;
