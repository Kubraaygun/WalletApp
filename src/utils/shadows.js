import { Platform } from "react-native";
import { Colors } from "./colors";

// Platform-specific shadow utilities
const createShadow = (elevation, color = Colors.BLACK) => {
    if (Platform.OS === "android") {
        return {
            elevation,
        };
    }

    // iOS shadows based on elevation
    const shadowConfig = {
        0: { shadowOffset: { width: 0, height: 0 }, shadowRadius: 0, shadowOpacity: 0 },
        1: { shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, shadowOpacity: 0.05 },
        2: { shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, shadowOpacity: 0.08 },
        4: { shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, shadowOpacity: 0.1 },
        6: { shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, shadowOpacity: 0.12 },
        8: { shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, shadowOpacity: 0.14 },
        12: { shadowOffset: { width: 0, height: 12 }, shadowRadius: 24, shadowOpacity: 0.16 },
        16: { shadowOffset: { width: 0, height: 16 }, shadowRadius: 32, shadowOpacity: 0.18 },
        24: { shadowOffset: { width: 0, height: 24 }, shadowRadius: 48, shadowOpacity: 0.2 },
    };

    const nearestElevation = Object.keys(shadowConfig)
        .map(Number)
        .reduce((prev, curr) => (Math.abs(curr - elevation) < Math.abs(prev - elevation) ? curr : prev));

    return {
        shadowColor: color,
        ...shadowConfig[nearestElevation],
    };
};

// Pre-defined shadow levels
export const Shadows = {
    none: createShadow(0),
    xs: createShadow(1),
    sm: createShadow(2),
    md: createShadow(4),
    lg: createShadow(8),
    xl: createShadow(12),
    "2xl": createShadow(16),
    "3xl": createShadow(24),
};

// Colored shadows (for glow effects)
export const GlowShadows = {
    primary: {
        ...Platform.select({
            ios: {
                shadowColor: Colors.ACCENT,
                shadowOffset: { width: 0, height: 8 },
                shadowRadius: 24,
                shadowOpacity: 0.35,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    success: {
        ...Platform.select({
            ios: {
                shadowColor: Colors.SUCCESS,
                shadowOffset: { width: 0, height: 8 },
                shadowRadius: 24,
                shadowOpacity: 0.35,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    error: {
        ...Platform.select({
            ios: {
                shadowColor: Colors.ERROR,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
                shadowOpacity: 0.3,
            },
            android: {
                elevation: 6,
            },
        }),
    },
};

// Card-specific shadows
export const CardShadows = {
    subtle: {
        ...createShadow(2),
        backgroundColor: Colors.SURFACE,
    },
    default: {
        ...createShadow(4),
        backgroundColor: Colors.SURFACE,
    },
    elevated: {
        ...createShadow(8),
        backgroundColor: Colors.SURFACE,
    },
    floating: {
        ...createShadow(16),
        backgroundColor: Colors.SURFACE,
    },
};

export { createShadow };
