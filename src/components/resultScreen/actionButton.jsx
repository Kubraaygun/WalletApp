import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import CustomButton from "../customButton";
import { Colors } from "../../utils/colors";
import { Spacing, IconSize } from "../../utils/spacing";

const ActionButtons = ({ success, navigation }) => {
  return (
    <View style={styles.container}>
      {success ? (
        <>
          <CustomButton
            title="Ana Sayfa"
            onPress={() => navigation.navigate("HomeScreen")}
            variant="primary"
            size="lg"
            leftIcon={<Icon name="home" size={IconSize.sm} color={Colors.WHITE} />}
          />
          <CustomButton
            title="Yeni Transfer"
            onPress={() => navigation.navigate("TransferScreen")}
            variant="outline"
            size="lg"
            leftIcon={<Icon name="send" size={IconSize.sm} color={Colors.ACCENT} />}
          />
        </>
      ) : (
        <>
          <CustomButton
            title="Tekrar Dene"
            onPress={() => navigation.navigate("TransferScreen")}
            variant="primary"
            size="lg"
            leftIcon={<Icon name="refresh-cw" size={IconSize.sm} color={Colors.WHITE} />}
          />
          <CustomButton
            title="Ana Sayfa"
            onPress={() => navigation.navigate("HomeScreen")}
            variant="ghost"
            size="lg"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
});

export default ActionButtons;
