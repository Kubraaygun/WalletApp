import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import CustomButton from "../customButton";
import { Colors } from "../../utils/colors";
import { Spacing, IconSize } from "../../utils/spacing";
import { TRANSFERSCREEN } from "../../utils/routes";

const ActionButtons = ({ success, navigation }) => {
  const goToHome = () => {
    // Stack'teki tüm ekranları temizleyip MainTabs'a dön
    navigation.popToTop();
  };

  const goToTransfer = () => {
    // TransferScreen'e git (replace ile, ResultScreen'i stack'ten kaldır)
    navigation.replace(TRANSFERSCREEN);
  };

  return (
    <View style={styles.container}>
      {success ? (
        <>
          <CustomButton
            title="Ana Sayfa"
            onPress={goToHome}
            variant="primary"
            size="lg"
            leftIcon={<Icon name="home" size={IconSize.sm} color={Colors.WHITE} />}
          />
          <CustomButton
            title="Yeni Transfer"
            onPress={goToTransfer}
            variant="outline"
            size="lg"
            leftIcon={<Icon name="send" size={IconSize.sm} color={Colors.ACCENT} />}
          />
        </>
      ) : (
        <>
          <CustomButton
            title="Tekrar Dene"
            onPress={goToTransfer}
            variant="primary"
            size="lg"
            leftIcon={<Icon name="refresh-cw" size={IconSize.sm} color={Colors.WHITE} />}
          />
          <CustomButton
            title="Ana Sayfa"
            onPress={goToHome}
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
