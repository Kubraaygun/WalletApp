import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base unit for 8px grid system
const BASE_UNIT = 8;

// Spacing scale (8px grid)
export const Spacing = {
    none: 0,
    xxs: BASE_UNIT * 0.5,    // 4
    xs: BASE_UNIT,           // 8
    sm: BASE_UNIT * 1.5,     // 12
    md: BASE_UNIT * 2,       // 16
    lg: BASE_UNIT * 3,       // 24
    xl: BASE_UNIT * 4,       // 32
    "2xl": BASE_UNIT * 5,    // 40
    "3xl": BASE_UNIT * 6,    // 48
    "4xl": BASE_UNIT * 8,    // 64
    "5xl": BASE_UNIT * 10,   // 80
};

// Border Radius
export const BorderRadius = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
    full: 9999,
};

// Icon Sizes
export const IconSize = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    "2xl": 40,
    "3xl": 48,
};

// Avatar Sizes
export const AvatarSize = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    "2xl": 64,
    "3xl": 80,
};

// Button Heights
export const ButtonHeight = {
    sm: 36,
    md: 44,
    lg: 52,
    xl: 60,
};

// Input Heights
export const InputHeight = {
    sm: 40,
    md: 48,
    lg: 56,
};

// Card Dimensions
export const CardPadding = {
    sm: Spacing.sm,
    md: Spacing.md,
    lg: Spacing.lg,
};

// Screen Padding
export const ScreenPadding = {
    horizontal: Spacing.md,
    vertical: Spacing.lg,
};

// Layout constants
export const Layout = {
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    maxContentWidth: 400,
    headerHeight: 56,
    tabBarHeight: 60,
    safeAreaBottom: 34,
};

// Common layout patterns
export const LayoutStyles = {
    screenContainer: {
        flex: 1,
        paddingHorizontal: ScreenPadding.horizontal,
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
};
