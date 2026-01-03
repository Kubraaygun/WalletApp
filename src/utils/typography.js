import { Platform } from "react-native";

// Font Family (System fonts for now, can be replaced with custom fonts)
const FontFamily = {
    regular: Platform.select({
        ios: "System",
        android: "Roboto",
    }),
    medium: Platform.select({
        ios: "System",
        android: "Roboto",
    }),
    semibold: Platform.select({
        ios: "System",
        android: "Roboto",
    }),
    bold: Platform.select({
        ios: "System",
        android: "Roboto",
    }),
};

// Font Weights
const FontWeight = {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
};

// Font Sizes (based on 4px scale)
const FontSize = {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 40,
    "6xl": 48,
};

// Line Heights
const LineHeight = {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
};

// Letter Spacing
const LetterSpacing = {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
};

// Pre-composed Text Styles
export const TextStyles = {
    // Display - Hero balance, splash screens
    displayLarge: {
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
        fontSize: FontSize["5xl"],
        lineHeight: FontSize["5xl"] * LineHeight.tight,
        letterSpacing: LetterSpacing.tight,
    },
    displayMedium: {
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
        fontSize: FontSize["4xl"],
        lineHeight: FontSize["4xl"] * LineHeight.tight,
        letterSpacing: LetterSpacing.tight,
    },
    displaySmall: {
        fontFamily: FontFamily.semibold,
        fontWeight: FontWeight.semibold,
        fontSize: FontSize["3xl"],
        lineHeight: FontSize["3xl"] * LineHeight.snug,
    },

    // Headings
    h1: {
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
        fontSize: FontSize["2xl"],
        lineHeight: FontSize["2xl"] * LineHeight.snug,
    },
    h2: {
        fontFamily: FontFamily.semibold,
        fontWeight: FontWeight.semibold,
        fontSize: FontSize.xl,
        lineHeight: FontSize.xl * LineHeight.snug,
    },
    h3: {
        fontFamily: FontFamily.semibold,
        fontWeight: FontWeight.semibold,
        fontSize: FontSize.lg,
        lineHeight: FontSize.lg * LineHeight.normal,
    },
    h4: {
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
        fontSize: FontSize.md,
        lineHeight: FontSize.md * LineHeight.normal,
    },

    // Body Text
    bodyLarge: {
        fontFamily: FontFamily.regular,
        fontWeight: FontWeight.regular,
        fontSize: FontSize.md,
        lineHeight: FontSize.md * LineHeight.relaxed,
    },
    bodyMedium: {
        fontFamily: FontFamily.regular,
        fontWeight: FontWeight.regular,
        fontSize: FontSize.base,
        lineHeight: FontSize.base * LineHeight.relaxed,
    },
    bodySmall: {
        fontFamily: FontFamily.regular,
        fontWeight: FontWeight.regular,
        fontSize: FontSize.sm,
        lineHeight: FontSize.sm * LineHeight.normal,
    },

    // Labels & Captions
    labelLarge: {
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
        fontSize: FontSize.base,
        lineHeight: FontSize.base * LineHeight.normal,
    },
    labelMedium: {
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
        fontSize: FontSize.sm,
        lineHeight: FontSize.sm * LineHeight.normal,
    },
    labelSmall: {
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
        fontSize: FontSize.xs,
        lineHeight: FontSize.xs * LineHeight.normal,
        letterSpacing: LetterSpacing.wide,
        textTransform: "uppercase",
    },

    // Caption
    caption: {
        fontFamily: FontFamily.regular,
        fontWeight: FontWeight.regular,
        fontSize: FontSize.xs,
        lineHeight: FontSize.xs * LineHeight.normal,
    },

    // Button Text
    buttonLarge: {
        fontFamily: FontFamily.semibold,
        fontWeight: FontWeight.semibold,
        fontSize: FontSize.md,
        lineHeight: FontSize.md * LineHeight.normal,
    },
    buttonMedium: {
        fontFamily: FontFamily.semibold,
        fontWeight: FontWeight.semibold,
        fontSize: FontSize.base,
        lineHeight: FontSize.base * LineHeight.normal,
    },
    buttonSmall: {
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
        fontSize: FontSize.sm,
        lineHeight: FontSize.sm * LineHeight.normal,
    },

    // Amount/Currency
    amountLarge: {
        fontFamily: FontFamily.bold,
        fontWeight: FontWeight.bold,
        fontSize: FontSize["4xl"],
        lineHeight: FontSize["4xl"] * LineHeight.tight,
        letterSpacing: LetterSpacing.tighter,
    },
    amountMedium: {
        fontFamily: FontFamily.semibold,
        fontWeight: FontWeight.semibold,
        fontSize: FontSize["2xl"],
        lineHeight: FontSize["2xl"] * LineHeight.tight,
    },
    amountSmall: {
        fontFamily: FontFamily.medium,
        fontWeight: FontWeight.medium,
        fontSize: FontSize.lg,
        lineHeight: FontSize.lg * LineHeight.tight,
    },
};

export { FontFamily, FontWeight, FontSize, LineHeight, LetterSpacing };
