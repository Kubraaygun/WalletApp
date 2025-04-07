import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import { width } from "../utils/constant";

const AnimationComponent = ({ balance }) => {
  const [animatedBalance] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0)); // Başlangıçta silik

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

      // Opaklık (opacity) animasyonu - Silikten belirginleşmeye
      Animated.timing(opacity, {
        toValue: 1, // Belirginleşecek
        duration: 600,
        useNativeDriver: true, // Native tarafında çalışacak
      }),
    ]).start();
  };

  return (
    <Animated.Text
      style={{
        fontSize: 32,
        fontWeight: "bold",
        opacity: opacity, // Opaklık değeri animasyonla değişecek
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
