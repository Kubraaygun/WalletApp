import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Colors } from "../../utils/colors";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const QuickActionButton = ({ icon, label, onPress, color = Colors.ACCENT }) => {
    return (
        <TouchableOpacity
            style={styles.actionButton}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Icon name={icon} size={IconSize.md} color={color} />
            </View>
            <Text style={styles.actionLabel} numberOfLines={1}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const QuickActions = ({ navigation }) => {
    const handleNavigate = (screen) => {
        if (navigation && screen) {
            navigation.navigate(screen);
        }
    };

    const actions = [
        {
            icon: "send",
            label: "Gönder",
            color: Colors.ACCENT,
            onPress: () => handleNavigate("TransferScreen"),
        },
        {
            icon: "download",
            label: "Al",
            color: Colors.SUCCESS,
            onPress: () => console.log("Al pressed"), // TODO: Para isteme ekranı
        },
        {
            icon: "maximize",
            label: "QR Tara",
            color: Colors.SECONDARY,
            onPress: () => handleNavigate("QRScannerScreen"),
        },
        {
            icon: "more-horizontal",
            label: "Daha Fazla",
            color: Colors.GRAY_500,
            onPress: () => console.log("More pressed"), // TODO: Daha fazla menüsü
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
            <View style={styles.actionsGrid}>
                {actions.map((action, index) => (
                    <QuickActionButton
                        key={index}
                        icon={action.icon}
                        label={action.label}
                        color={action.color}
                        onPress={action.onPress}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.TEXT_PRIMARY,
        marginBottom: Spacing.md,
    },
    actionsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionButton: {
        alignItems: "center",
        flex: 1,
        paddingVertical: Spacing.xs,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.lg,
        justifyContent: "center",
        alignItems: "center",
        ...Shadows.sm,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: Colors.TEXT_PRIMARY,
        marginTop: Spacing.xs,
    },
});

export default QuickActions;
