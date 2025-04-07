import React from "react";
import CustomTextInput from "../customTextInput";

const PhoneNumberInput = ({ phoneNumber, setPhoneNumber }) => (
  <CustomTextInput
    placeholder="Telefon Numarası"
    keyboardType="numeric"
    value={phoneNumber}
    onChangeText={setPhoneNumber}
  />
);

export default PhoneNumberInput;
