import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../utils/colors";

const CardComponent = () => {
  const [windowHeight, setWindowHeight] = useState(Dimensions.get("window").height);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const onChange = ({ window }) => {
      setWindowHeight(window.height);
      setWindowWidth(window.width);
    };

    Dimensions.addEventListener("change", onChange);

    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <View style={[styles.card, { height: windowHeight * 0.25, width: windowWidth * 0.9 }]}>
      <Text style={styles.cardTitle}>Dinamik Kart</Text>
      <Text
