import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Avatar from "../avatar";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, IconSize } from "../../utils/spacing";

const HomeHeader = ({ userName = "Kullanıcı", onNotificationPress, onProfilePress }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Günaydın";
        if (hour < 18) return "İyi günler";
        return "İyi akşamlar";
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.profileSection} onPress={onProfilePress}>
                <Avatar name={userName} size="md" showOnline onlineStatus="online" />
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                    <Text style={styles.userName}>{userName}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
                <Icon name="bell" size={IconSize.md} color={Colors.TEXT_PRIMARY} />
                <View style={styles.notificationBadge} />
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
        color: Colors.TEXT_SECONDARY,
    },
    userName: {
        ...TextStyles.h4,
        color: Colors.TEXT_PRIMARY,
        marginTop: 2,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.GRAY_100,
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
        backgroundColor: Colors.ERROR,
        borderWidth: 1.5,
        borderColor: Colors.SURFACE,
    },
});

export default HomeHeader;
