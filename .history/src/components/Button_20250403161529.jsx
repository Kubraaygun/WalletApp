// ReusableButton.js
import React from "react";
import { Button } from "react-native";

const Button = ({ title, onPress }) => {
  return <Button title={title} onPress={onPress} />;
};

export default ReusableButton;
