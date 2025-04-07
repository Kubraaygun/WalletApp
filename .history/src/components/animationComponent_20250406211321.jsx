import React, { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";

const TextAnimation = ({ text }) => {
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    // Her harf için ayrı Animated.Value oluştur
    const anims = text.split("").map(() => new Animated.Value(0));
    setAnimations(anims);

    // Harfleri sırayla görünür yap
    const animationsSequence = anims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animationsSequence).start();
  }, [text]);

  return (
    <View style={{ flexDirection: "row" }}>
      {text.split("").map((char, index) => (
        <Animated.Text
          key={index}
          style={{
            opacity: animations[index] || 0,
            fontSize: 32,
            fontWeight: "bold",
            transform: [
              {
                scale: animations[index]
                  ? animations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  : 1,
              },
            ],
          }}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  );
};

export default TextAnimation;
