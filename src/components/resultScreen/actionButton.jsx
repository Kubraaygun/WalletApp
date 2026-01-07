import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import CustomButton from "../customButton";
import { Colors } from "../../utils/colors";
import { Spacing, IconSize, moderateScale } from "../../utils/spacing";
import { TRANSFERSCREEN } from "../../utils/routes";
import { useTheme } from "../../contexts/ThemeContext";

const ActionButtons = ({ success, navigation }) => {
  const { colors } = useTheme();

  const goToHome = () => {
    // Stack'teki tüm ekranları temizleyip MainTabs'a dön
    navigation.popToTop();
  };

  const goToTransfer = () => {
    // TransferScreen'e git (replace ile, ResultScreen'i stack'ten kaldır)
    navigation.replace(TRANSFERSCREEN);
  };

  return (
    <View style={[styles.container, { marginTop: moderateScale(Spacing.md) }]}>
      {success ? (
        <>
          <CustomButton
            title="Ana Sayfa"
            onPress={goToHome}
            variant="primary"
            size="md"
            leftIcon={<Icon name="home" size={IconSize.sm} color={colors.WHITE} />}
          />
          <CustomButton
            title="Yeni Transfer"
            onPress={goToTransfer}
            variant="outline"
            size="md"
            leftIcon={<Icon name="send" size={IconSize.sm} color={colors.ACCENT} />}
          />
        </>
      ) : (
        <>
          <CustomButton
            title="Tekrar Dene"
            onPress={goToTransfer}
            variant="primary"
            size="md"
            leftIcon={<Icon name="refresh-cw" size={IconSize.sm} color={colors.WHITE} />}
          />
          <CustomButton
            title="Ana Sayfa"
            onPress={goToHome}
            variant="ghost"
            size="md"
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
    gap: Spacing.xxs,
  },
});

export default ActionButtons;
