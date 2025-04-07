import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import { width } from "../utils/constant";

const AnimationComponent = ({ balance }) => {
  const [animatedBalance] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(1));
  const [translateX] = useState(new Animated.Value(-width)); // Ekranın dışından başlayacak
  const [colorChange] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      // Bakiyeyi 0'dan hedef değere animasyonla yükselt
      Animated.timing(animatedBalance, {
        toValue: balance,
        duration: 800,
        useNativeDriver: false,
      }),
      // Yatay hareket - ekranın dışından içeri gelir
      Animated.timing(translateX, {
        toValue: 0, // Ekranın ortasına doğru kayacak
        duration: 600,
        useNativeDriver: true,
      }),
      // Büyütme
      Animated.spring(scale, {
        toValue: 1.3,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      // Renk değişimi
      Animated.timing(colorChange, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      // Eski haline dönme
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(colorChange, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [balance]);

  return (
    <Animated.Text
      style={{
        fontSize: 32,
        fontWeight: "bold",
        transform: [{ scale }, { translateX }],
        color: colorChange.interpolate({
          inputRange: [0, 1],
          outputRange: ["#000", "#00f"], // Renk değişimi örneği
        }),
      }}
    >
      {animatedBalance.interpolate({
        inputRange: [0, balance],
        outputRange: ["0", `${balance}`],
      })}
      TL
    </Animated.Text>
  );
};

export default AnimationComponent;
