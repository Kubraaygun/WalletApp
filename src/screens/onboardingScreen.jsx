import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../utils/colors";
import { TextStyles } from "../utils/typography";
import { Spacing, BorderRadius } from "../utils/spacing";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Cüzdanınız Her Zaman Yanınızda",
    description: "Paranızı güvenle saklayın, harcayın ve yönetin. Tek uygulama ile tüm finansal işlemlerinizi yapın.",
    image: require("../../assets/onboarding-wallet.png"),
  },
  {
    id: "2",
    title: "Anında Para Transferi",
    description: "Telefon numarası veya QR kod ile saniyeler içinde para gönderin ve alın.",
    image: require("../../assets/onboarding-transfer.png"),
  },
  {
    id: "3",
    title: "Güvenlik Önceliğimiz",
    description: "Face ID, Touch ID ve gelişmiş şifreleme ile paranız her zaman güvende.",
    image: require("../../assets/onboarding-security.png"),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
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
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("LoginScreen");
  };

  const renderSlide = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.imageContainer, { transform: [{ scale }], opacity }]}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: Colors.PRIMARY,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Atla</Text>
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
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {renderDots()}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          {isLastSlide ? (
            <Text style={styles.nextButtonText}>Başla</Text>
          ) : (
            <Icon name="arrow-right" size={24} color={Colors.WHITE} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    ...TextStyles.labelMedium,
    color: Colors.TEXT_SECONDARY,
  },
  slide: {
    width,
    alignItems: "center",
    paddingTop: 120,
  },
  imageContainer: {
    width: width * 0.7,
    height: height * 0.35,
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
    color: Colors.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    ...TextStyles.bodyLarge,
    color: Colors.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 24,
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
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    ...TextStyles.labelLarge,
    color: Colors.WHITE,
  },
});

export default OnboardingScreen;
