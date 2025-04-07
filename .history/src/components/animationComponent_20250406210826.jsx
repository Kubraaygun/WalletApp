import React, { useEffect, useState } from "react";
import { Animated } from "react-native";

const AnimationComponent = ({ balance }) => {
  const [oldBalance] = useState(balance); // Eski bakiye sabit kalacak
  const [animatedBalance] = useState(new Animated.Value(0)); // Yeni bakiye animasyonu

  useEffect(() => {
    // Animasyonu başlat
    startAnimation();
  }, [balance]);

  const startAnimation = () => {
    // Yeni bakiyeye doğru animasyonu başlat
    Animated.timing(animatedBalance, {
      toValue: balance, // Yeni bakiyeye geçiş
      duration: 1500, // Daha yavaş bir geçiş
      useNativeDriver: false, // Çünkü burada sadece metin değişecek
    }).start();
  };

  return (
    <Animated.View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* Eski bakiye */}
      <Animated.Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginRight: 10,
          opacity: 0.5, // Eski bakiye biraz silik gösterilecek
        }}
      >
        {oldBalance} TL
      </Animated.Text>

      {/* Yeni bakiye animasyonu */}
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
    </Animated.View>
  );
};

export default AnimationComponent;
