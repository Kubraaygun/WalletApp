import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import styles from "../../styles/components/loginscreen/loginHeaderStyles";
const LoginHeader = () => (
  <View style={styles.iconWrapper}>
    <Icon name="user" size={60} style={styles.iconStyleUser} />
    <Text style={styles.title}>Hoşgeldiniz</Text>
  </View>
);

export default LoginHeader;
