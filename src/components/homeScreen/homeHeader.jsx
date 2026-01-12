import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Avatar from "../avatar";
import { useTheme } from "../../contexts/ThemeContext";
import { TextStyles } from "../../utils/typography";
import { Spacing, IconSize } from "../../utils/spacing";

const HomeHeader = ({ userName = "Kullanici", onNotificationPress, onProfilePress }) => {
    const { colors, isDark, toggleTheme } = useTheme();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Gunaydin";
        if (hour < 18) return "Iyi gunler";
        return "Iyi aksamlar";
    };

    const handleThemeToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleTheme();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.profileSection} onPress={onProfilePress}>
                <Avatar name={userName} size="md" showOnline onlineStatus="online" />
                <View style={styles.greetingContainer}>
                    <Text style={[styles.greeting, { color: colors.TEXT_SECONDARY }]}>{getGreeting()}</Text>
                    <Text style={[styles.userName, { color: colors.TEXT_PRIMARY }]}>{userName}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
                {/* Theme Toggle */}
                <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.SURFACE }]} 
                    onPress={handleThemeToggle}
                >
                    <Icon 
                        name={isDark ? "sun" : "moon"} 
                        size={IconSize.sm} 
                        color={isDark ? "#F59E0B" : colors.TEXT_PRIMARY} 
                    />
                </TouchableOpacity>

                {/* Notifications */}
                <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.SURFACE }]} 
                    onPress={onNotificationPress}
                >
                    <Icon name="bell" size={IconSize.sm} color={colors.TEXT_PRIMARY} />
                    <View style={[styles.notificationBadge, { borderColor: colors.SURFACE }]} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    greetingContainer: {
        marginLeft: Spacing.sm,
    },
    greeting: {
        ...TextStyles.caption,
    },
    userName: {
        ...TextStyles.h4,
        marginTop: 2,
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.xs,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    notificationBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF3B30",
        borderWidth: 1.5,
    },
});

export default HomeHeader;
