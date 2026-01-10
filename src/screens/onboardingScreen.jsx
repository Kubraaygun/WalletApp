import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../contexts/ThemeContext";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius } from "../utils/spacing";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Cüzdanınız Her Zaman Yanınızda",
    description: "Paranızı güvenle saklayın, harcayın ve yönetin. Tek uygulama ile tüm finansal işlemlerinizi yapın.",
    image: require("../../assets/onboarding-wallet.png"),
    bgColor: "#E8F4FD",
  },
  {
    id: "2",
    title: "Anında Para Transferi",
    description: "Telefon numarası veya QR kod ile saniyeler içinde para gönderin ve alın.",
    image: require("../../assets/onboarding-transfer.png"),
    bgColor: "#EDE8FD",
  },
  {
    id: "3",
    title: "Güvenlik Önceliğimiz",
    description: "Face ID, Touch ID ve gelişmiş şifreleme ile paranız her zaman güvende.",
    image: require("../../assets/onboarding-security.png"),
    bgColor: "#E8FDF4",
  },
];

const OnboardingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const updateIndex = (index) => {
    setCurrentIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const newIndex = Math.round(event.contentOffset.x / width);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
        runOnJS(updateIndex)(newIndex);
      }
    },
  });

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("LoginScreen");
  };

  const renderSlide = ({ item, index }) => (
    <SlideItem 
      item={item} 
      index={index} 
      scrollX={scrollX}
      colors={colors}
    />
  );

  const isLastSlide = currentIndex === slides.length - 1;

  // Progress bar animated style
  const progressStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollX.value,
      [0, width * (slides.length - 1)],
      [0, 100],
      Extrapolation.CLAMP
    );
    return {
      width: `${progress}%`,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.GRAY_200 }]}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { backgroundColor: colors.PRIMARY },
            progressStyle,
          ]} 
        />
      </View>

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: colors.TEXT_SECONDARY }]}>Atla</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <DotIndicator 
              key={index} 
              index={index} 
              scrollX={scrollX}
              colors={colors}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: colors.PRIMARY }]} 
          onPress={handleNext}
          activeOpacity={0.8}
        >
          {isLastSlide ? (
            <Text style={styles.nextButtonText}>Başla</Text>
          ) : (
            <Icon name="arrow-right" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * SlideItem - Individual slide with parallax effect
 */
const SlideItem = ({ item, index, scrollX, colors }) => {
  // Parallax effect for image
  const imageStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [width * 0.3, 0, -width * 0.3],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  // Text fade in
  const textStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, -30],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.imageContainer, imageStyle]}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.TEXT_SECONDARY }]}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

/**
 * DotIndicator - Animated pagination dot
 */
const DotIndicator = ({ index, scrollX, colors }) => {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [8, 28, 8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: colors.PRIMARY },
        dotStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    position: "absolute",
    top: 50,
    left: Spacing.xl,
    right: Spacing.xl,
    height: 4,
    borderRadius: 2,
    zIndex: 10,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  skipButton: {
    position: "absolute",
    top: 70,
    right: Spacing.xl,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    ...TextStyles.labelMedium,
  },
  slide: {
    width,
    alignItems: "center",
    paddingTop: 120,
  },
  imageContainer: {
    width: width * 0.75,
    height: height * 0.38,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    alignItems: "center",
  },
  title: {
    ...TextStyles.h2,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    ...TextStyles.bodyLarge,
    textAlign: "center",
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 50,
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    ...TextStyles.labelLarge,
    color: "#FFFFFF",
  },
});

export default OnboardingScreen;
