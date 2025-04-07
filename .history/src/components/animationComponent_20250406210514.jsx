import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import { width } from "../utils/constant";

const AnimationComponent = ({ balance }) => {
  const [animatedBalance] = useState(new Animated.Value(0));
  const [previousBalance] = useState(new Animated.Value(0)); // Eski bakiye
  const [opacity] = useState(new Animated.Value(0)); // Başlangıçta silik
  const [scale] = useState(new Animated.Value(0)); // Başlangıçta küçük

  useEffect(() => {
    startAnimation();
  }, [balance]);

  const startAnimation = () => {
    // Eski bakiyeyi silip yeni bakiyeye geçiş animasyonu
    Animated.sequence([
      // Eski bakiyeyi silme ve yeni bakiyeyi yükseltme animasyonu
      Animated.parallel([
        Animated.timing(previousBalance, {
          toValue: 0, // Eski bakiyeyi sıfırlıyoruz
          duration: 400, // Daha hızlı bir geçiş
          useNativeDriver: false,
        }),
        Animated.timing(animatedBalance, {
          toValue: balance, // Yeni bakiyeyi animasyonla yükselt
          duration: 800,
          useNativeDriver: false,
        }),
      ]),

      // Opaklık (opacity) animasyonu ve büyüme (scale) animasyonu
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1, // Belirginleşecek
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1, // Büyüme
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <>
      <Animated.Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          opacity: opacity, // Opaklık değeri animasyonla değişecek
          transform: [{ scale }],
        }}
      >
        {previousBalance.interpolate({
          inputRange: [0, balance],
          outputRange: ["0", `${balance}`], // Eski bakiyeyi gösterecek
        })}
        TL
      </Animated.Text>

      <Animated.Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          opacity: opacity, // Opaklık değeri animasyonla değişecek
          transform: [{ scale }],
        }}
      >
        {animatedBalance.interpolate({
          inputRange: [0, balance],
          outputRange: ["0", `${balance}`], // Yeni bakiyeyi gösterecek
        })}
        TL
      </Animated.Text>
    </>
  );
};

export default AnimationComponent;
