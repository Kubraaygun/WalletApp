import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const LoginHeader = () => (
  <View style={styles.iconWrapper}>
    <Icon name="user" size={60} style={styles.iconStyleUser} />
    <Text style={styles.title}>Welcome</Text>
  </View>
);

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconStyleUser: {
    position: "relative",
    top: 0,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoginHeader;
