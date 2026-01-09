import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";
import { ScalePress } from "../animations";

const QuickActionButton = ({ icon, label, onPress, color, textColor }) => {
    return (
        <ScalePress
            onPress={onPress}
            scaleValue={0.92}
            style={styles.actionButton}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <Icon name={icon} size={IconSize.md} color={color} />
            </View>
            <Text style={[styles.actionLabel, { color: textColor }]} numberOfLines={1}>
                {label}
            </Text>
        </ScalePress>
    );
};

const MoreMenuItem = ({ icon, label, onPress, color, textColor, borderColor }) => (
    <ScalePress 
        onPress={onPress}
        scaleValue={0.98}
        style={[styles.menuItem, { borderBottomColor: borderColor }]}
    >
        <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
            <Icon name={icon} size={20} color={color} />
        </View>
        <Text style={[styles.menuLabel, { color: textColor }]}>{label}</Text>
        <Icon name="chevron-right" size={18} color={color} />
    </ScalePress>
);

const QuickActions = ({ navigation }) => {
    const { colors } = useTheme();
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const handleNavigate = (screen) => {
        setShowMoreMenu(false);
        if (navigation && screen) {
            navigation.navigate(screen);
        }
    };

    const actions = [
        {
            icon: "send",
            label: "Gonder",
            color: colors.PRIMARY,
            onPress: () => handleNavigate("TransferScreen"),
        },
        {
            icon: "download",
            label: "Al",
            color: colors.SUCCESS,
            onPress: () => console.log("Al pressed"),
        },
        {
            icon: "maximize",
            label: "QR Tara",
            color: colors.SECONDARY,
            onPress: () => handleNavigate("QRScannerScreen"),
        },
        {
            icon: "grid",
            label: "Daha Fazla",
            color: colors.GRAY_500,
            onPress: () => setShowMoreMenu(true),
        },
    ];

    const moreMenuItems = [
        {
            icon: "trending-up",
            label: "Kripto Fiyatlari",
            color: "#F7931A",
            screen: "CryptoScreen",
        },
        {
            icon: "pie-chart",
            label: "Harcama Istatistikleri",
            color: colors.PRIMARY,
            screen: "StatsScreen",
        },
        {
            icon: "credit-card",
            label: "Kartlarim",
            color: colors.SECONDARY,
            screen: "CardsScreen",
        },
        {
            icon: "repeat",
            label: "Doviz Cevirici",
            color: colors.SUCCESS,
            screen: "CurrencyConverterScreen",
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>Hizli Islemler</Text>
            <View style={[styles.actionsGrid, { backgroundColor: colors.CARD }, Shadows.sm]}>
                {actions.map((action, index) => (
                    <QuickActionButton
                        key={index}
                        icon={action.icon}
                        label={action.label}
                        color={action.color}
                        textColor={colors.TEXT_PRIMARY}
                        onPress={action.onPress}
                    />
                ))}
            </View>

            {/* More Menu Modal */}
            <Modal
                visible={showMoreMenu}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowMoreMenu(false)}
            >
                <TouchableOpacity
                    style={[styles.modalOverlay, { backgroundColor: colors.OVERLAY }]}
                    activeOpacity={1}
                    onPress={() => setShowMoreMenu(false)}
                >
                    <View style={[styles.menuContainer, { backgroundColor: colors.BACKGROUND }]}>
                        <View style={[styles.menuHandle, { backgroundColor: colors.GRAY_300 }]} />
                        <Text style={[styles.menuTitle, { color: colors.TEXT_PRIMARY }]}>Daha Fazla</Text>
                        {moreMenuItems.map((item, index) => (
                            <MoreMenuItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                color={item.color}
                                textColor={colors.TEXT_PRIMARY}
                                borderColor={colors.BORDER}
                                onPress={() => handleNavigate(item.screen)}
                            />
                        ))}
                        <ScalePress
                            onPress={() => setShowMoreMenu(false)}
                            scaleValue={0.97}
                            style={[styles.closeButton, { backgroundColor: colors.SURFACE }]}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.TEXT_SECONDARY }]}>Kapat</Text>
                        </ScalePress>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    sectionTitle: {
        ...TextStyles.labelLarge,
        marginBottom: Spacing.md,
    },
    actionsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
    },
    actionButton: {
        alignItems: "center",
        flex: 1,
        paddingVertical: Spacing.xs,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: BorderRadius.lg,
        justifyContent: "center",
        alignItems: "center",
    },
    actionLabel: {
        ...TextStyles.labelSmall,
        marginTop: Spacing.xs,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    menuContainer: {
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.lg,
        paddingBottom: Spacing["2xl"],
    },
    menuHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: Spacing.lg,
    },
    menuTitle: {
        ...TextStyles.h4,
        marginBottom: Spacing.md,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        justifyContent: "center",
        alignItems: "center",
        marginRight: Spacing.sm,
    },
    menuLabel: {
        ...TextStyles.bodyMedium,
        flex: 1,
    },
    closeButton: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: "center",
        marginTop: Spacing.lg,
    },
    closeButtonText: {
        ...TextStyles.labelLarge,
    },
});

export default QuickActions;
