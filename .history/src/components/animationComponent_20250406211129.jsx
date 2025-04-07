import React, { useEffect, useState } from "react";
import { Animated, Text } from "react-native";

const AnimationComponent = ({ balance }) => {
  const [balanceDisplay, setBalanceDisplay] = useState(balance); // Ekranda gösterilecek bakiye
  const [animatedBalance] = useState(new Animated.Value(balance)); // Yeni bakiye animasyonu
  const [digits, setDigits] = useState(String(balance).split("").map(Number)); // Bakiyenin her bir basamağını ayrı ayrı animasyonla göstermek için

  useEffect(() => {
    // Bakiye değiştiğinde animasyonu başlat
    animateBalanceChange();
  }, [balance]);

  const animateBalanceChange = () => {
    const oldDigits = String(balanceDisplay).split("").map(Number);
    const newDigits = String(balance).split("").map(Number);

    let currentIndex = 0;

    // Her bir basamağı animasyonla güncelle
    const interval = setInterval(() => {
      if (currentIndex < newDigits.length) {
        // Mevcut basamağı güncelle
        Animated.timing(animatedBalance, {
          toValue: newDigits[currentIndex], // Her bir rakamı sırayla hedef değerine animasyonla getir
          duration: 200, // Her basamağın geçiş süresi
          useNativeDriver: false, // Text üzerinde çalışacağımız için false
        }).start();

        // Yeni değeri ekranda güncelle
        setDigits((prevDigits) => {
          const updatedDigits = [...prevDigits];
          updatedDigits[currentIndex] = newDigits[currentIndex]; // Mevcut basamağı yeni değeriyle değiştir
          return updatedDigits;
        });

        currentIndex++;
      } else {
        // Animasyon tamamlandığında aralığı durdur
        clearInterval(interval);
      }
    }, 300); // Aralığı belirleyerek her rakamı tek tek değiştirecek
  };

  return (
    <Text style={{ fontSize: 32, fontWeight: "bold" }}>
      {digits.map((digit, index) => (
        <Animated.Text key={index} style={{ opacity: animatedBalance }}>
          {digit}
        </Animated.Text>
      ))}
      TL
    </Text>
  );
};

export default AnimationComponent;
