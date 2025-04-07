import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import { width } from "../utils/constant";

const AnimationComponent = ({ balance }) => {
  const [animatedBalance] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(1));
  const [translateY] = useState(new Animated.Value(-100)); // Ekranın dışından başlayacak (yukarıdan)

  useEffect(() => {
    startAnimation();
  }, [balance]);

  const startAnimation = () => {
    Animated.sequence([
      // Bakiyeyi 0'dan hedef değere animasyonla yükselt
      Animated.timing(animatedBalance, {
        toValue: balance,
        duration: 800,
        useNativeDriver: false, // JavaScript tarafında çalışacak
      }),

      // Dikey hareket - yukarıdan aşağıya iner
      Animated.timing(translateY, {
        toValue: 0, // Ekranın ortasına doğru kayacak
        duration: 600,
        useNativeDriver: true, // Native tarafında çalışacak
      }),

      // Büyütme
      Animated.spring(scale, {
        toValue: 1.3,
        friction: 4,
        tension: 50,
        useNativeDriver: true, // Native tarafında çalışacak
      }),

      // Eski haline dönme
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true, // Native tarafında çalışacak
        }),
      ]),
    ]).start();
  };

  return (
    <Animated.Text
      style={{
        fontSize: 32,
        fontWeight: "bold",
        transform: [{ scale }, { translateY }],
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
