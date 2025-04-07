import React, { useEffect, useState } from "react";
import { Animated } from "react-native";

const AnimationComponent = ({ balance }) => {
  const [animatedBalance] = useState(new Animated.Value(0)); // Yeni bakiye animasyonu

  useEffect(() => {
    // Animasyonu başlat
    startAnimation();
  }, [balance]);

  const startAnimation = () => {
    // Yeni bakiyeye doğru animasyonu başlat
    Animated.timing(animatedBalance, {
      toValue: balance, // Yeni bakiyeye geçiş
      duration: 1500, // Yavaş geçiş
      useNativeDriver: false, // Çünkü metin üzerinde animasyon yapıyoruz
    }).start();
  };

  return (
    <Animated.Text
      style={{
        fontSize: 32,
        fontWeight: "bold",
      }}
    >
      {animatedBalance.interpolate({
        inputRange: [0, balance],
        outputRange: ["0", `${balance}`], // Sayılar animasyonla artacak
      })}
      TL
    </Animated.Text>
  );
};

export default AnimationComponent;
