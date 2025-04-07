import React, { useEffect, useState } from "react";
import { Animated } from "react-native";

const AnimationComponent = ({ balance }) => {
  const [animatedBalance] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(1)); // Başlangıçta görünür
  const [scale] = useState(new Animated.Value(1)); // Başlangıçta normal boyutta

  useEffect(() => {
    startAnimation();
  }, [balance]);

  const startAnimation = () => {
    Animated.sequence([
      // İlk olarak eski bakiye animasyonu
      Animated.timing(animatedBalance, {
        toValue: balance, // Yeni bakiyeye geçiş
        duration: 1000, // Sayıların geçiş süresi
        useNativeDriver: false, // Opaklık ve metin animasyonları için false
      }),

      // Opaklık (opacity) ve büyüme (scale) animasyonları
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0, // Eski bakiyeyi gizle
          duration: 400, // Daha hızlı geçiş
          useNativeDriver: true, // Opaklık animasyonu
        }),
        Animated.spring(scale, {
          toValue: 1.3, // Biraz büyüme
          friction: 4,
          tension: 50,
          useNativeDriver: true, // Native sürücü ile performans artırma
        }),
      ]),

      // Yeni bakiyeyi göstermek için tekrar opaklık ve scale animasyonu
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1, // Yeni bakiyeyi görünür yap
          duration: 400, // Yavaş geçiş
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1, // Eski boyutuna dön
          friction: 4,
          tension: 50,
          useNativeDriver: true, // Native sürücü ile
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
        outputRange: ["0", `${balance}`], // Yeni bakiyeyi gösterecek şekilde animasyon
      })}
      TL
    </Animated.Text>
  );
};

export default AnimationComponent;
