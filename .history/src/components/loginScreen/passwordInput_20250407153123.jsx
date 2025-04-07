import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CustomTextInput from "../customTextInput";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../../utils/colors";
import styles from "../../styles/components/loginscreen/passwordInputStyles";
const PasswordInput = ({
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  toggleVisibility,
}) => (
  <>
    <View style={styles.passwordContainer}>
      <CustomTextInput
        placeholder="Password"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={toggleVisibility}>
        <Icon
          name={secureTextEntry ? "eye-off" : "eye"}
          size={20}
          color={secureTextEntry ? Colors.LIGHTGRAY : Colors.BLACK}
        />
      </TouchableOpacity>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

export default PasswordInput;
