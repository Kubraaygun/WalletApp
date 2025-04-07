import React, { useEffect, useState } from "react";
import { Animated, View } from "react-native";

const AnimatedBalance = ({ balance }) => {
  const [digits, setDigits] = useState([]);
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const strBalance = balance.toString();
    const splitDigits = strBalance.split("");

    const newAnimations = splitDigits.map(() => new Animated.Value(0));
    setDigits(splitDigits);
    setAnimations(newAnimations);

    Animated.stagger(
      100,
      newAnimations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [balance]);

  return (
    <View style={{ flexDirection: "row" }}>
      {digits.map((char, index) => (
        <Animated.Text
          key={index}
          style={{
            fontSize: 32,
            fontWeight: "bold",
            opacity: animations[index] || 0,
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

export default AnimatedBalance;
