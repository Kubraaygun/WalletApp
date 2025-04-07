// components/ResultInfo.js
import React from "react";
import { Text, View } from "react-native";
import styles from "../../styles/components/resultScreen/resultInfoStyles";
const ResultInfo = ({
  formattedAmount,
  phoneNumber,
  description,
  formattedDate,
  formattedTime,
}) => {
  return (
    <View style={styles.resultInfo}>
      <Text style={styles.info}>Tutar: {formattedAmount} TL</Text>
      <Text style={styles.info}>Alıcı: {phoneNumber}</Text>
      {description && <Text style={styles.info}>{description}</Text>}
      <Text style={styles.info}>Tarih: {formattedDate}</Text>
      <Text style={styles.info}>Saat: {formattedTime}</Text>
    </View>
  );
};

export default ResultInfo;
