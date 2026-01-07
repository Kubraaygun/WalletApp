import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import Avatar from "../avatar";
import { useTheme } from "../../contexts/ThemeContext";
import { TextStyles } from "../../utils/typography";
import { Spacing, IconSize } from "../../utils/spacing";

const HomeHeader = ({ userName = "Kullanici", onNotificationPress, onProfilePress }) => {
    const { colors } = useTheme();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Gunaydin";
        if (hour < 18) return "Iyi gunler";
        return "Iyi aksamlar";
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

            <TouchableOpacity 
                style={[styles.notificationButton, { backgroundColor: colors.SURFACE }]} 
                onPress={onNotificationPress}
            >
                <Icon name="bell" size={IconSize.md} color={colors.TEXT_PRIMARY} />
                <View style={[styles.notificationBadge, { borderColor: colors.SURFACE }]} />
            </TouchableOpacity>
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
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    notificationBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF3B30",
        borderWidth: 1.5,
    },
});

export default HomeHeader;
