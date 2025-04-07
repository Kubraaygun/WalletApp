import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import { width } from "../utils/constant";

const AnimationComponent = ({ balance }) => {
  const [animatedBalance] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0)); // Başlangıçta silik
  const [scale] = useState(new Animated.Value(0)); // Başlangıçta küçük

  useEffect(() => {
    startAnimation();
  }, [balance]);

  const startAnimation = () => {
    Animated.sequence([
      // Bakiyeyi 0'dan hedef değere animasyonla yükselt
      Animated.timing(animatedBalance, {
        toValue: balance,
        duration: 500, // Daha yavaş bir geçiş için süreyi arttırdık
        useNativeDriver: false, // JavaScript tarafında çalışacak
      }),

      // Opaklık (opacity) animasyonu ve büyüme (scale) animasyonu
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1, // Belirginleşecek
          duration: 1200, // Daha yavaş bir geçiş için süreyi arttırdık
          useNativeDriver: true, // Native tarafında çalışacak
        }),
        Animated.spring(scale, {
          toValue: 1, // Büyüme
          friction: 3,
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
        opacity: opacity, // Opaklık değeri animasyonla değişecek
        transform: [{ scale }], // Büyüme animasyonu
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
