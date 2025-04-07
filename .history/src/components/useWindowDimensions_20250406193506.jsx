import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    // React Native 0.65 ve sonrası sürümler için
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      // Component unmount olduğunda listener'ı temizliyoruz
      subscription.remove();
    };
  }, []);

  return dimensions;
};

export default useWindowDimensions;
