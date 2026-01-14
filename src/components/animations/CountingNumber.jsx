import React, { useEffect, useRef } from "react";
import { Text, Animated, StyleSheet } from "react-native";
import { TextStyles } from "../../utils/typography";

/**
 * Animasyonlu sayı sayma bileşeni
 * Bakiye veya para miktarını animasyonlu gösterir
 */
const CountingNumber = ({
  value,
  duration = 1000,
  prefix = "₺",
  suffix = "",
  style,
  decimals = 2, 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState("0");

  useEffect(() => {
    animatedValue.setValue(0);
    
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value: v }) => {
      const formatted = v.toLocaleString("tr-TR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      setDisplayValue(formatted);
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, duration, decimals]);

  return (
    <Text style={[styles.text, style]}>
      {prefix}{displayValue}{suffix}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...TextStyles.h1,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});

export default CountingNumber;
