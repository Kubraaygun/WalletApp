import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Colors } from "../../utils/colors";
import { TextStyles } from "../../utils/typography";
import { Spacing, BorderRadius, IconSize } from "../../utils/spacing";
import { Shadows } from "../../utils/shadows";

const QuickActionButton = ({ icon, label, onPress, color = Colors.PRIMARY }) => {
    return (
        <TouchableOpacity
            style={styles.actionButton}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <Icon name={icon} size={IconSize.md} color={color} />
            </View>
            <Text style={styles.actionLabel} numberOfLines={1}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const MoreMenuItem = ({ icon, label, onPress, color = Colors.TEXT_PRIMARY }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={[styles.menuIcon, { backgroundColor: `${color}15` }]}>
            <Icon name={icon} size={20} color={color} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
        <Icon name="chevron-right" size={18} color={Colors.GRAY_400} />
    </TouchableOpacity>
);

const QuickActions = ({ navigation }) => {
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
            label: "Gönder",
            color: Colors.PRIMARY,
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
            icon: "grid",
            label: "Daha Fazla",
            color: Colors.GRAY_600,
            onPress: () => setShowMoreMenu(true),
        },
    ];

    const moreMenuItems = [
        {
            icon: "trending-up",
            label: "Kripto Fiyatları",
            color: "#F7931A",
            screen: "CryptoScreen",
        },
        {
            icon: "pie-chart",
            label: "Harcama İstatistikleri",
            color: Colors.PRIMARY,
            screen: "StatsScreen",
        },
        {
            icon: "credit-card",
            label: "Kartlarım",
            color: Colors.SECONDARY,
            screen: "CardsScreen",
        },
        {
            icon: "repeat",
            label: "Döviz Çevirici",
            color: Colors.SUCCESS,
            screen: "CurrencyConverterScreen",
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

            {/* More Menu Modal */}
            <Modal
                visible={showMoreMenu}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowMoreMenu(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMoreMenu(false)}
                >
                    <View style={styles.menuContainer}>
                        <View style={styles.menuHandle} />
                        <Text style={styles.menuTitle}>Daha Fazla</Text>
                        {moreMenuItems.map((item, index) => (
                            <MoreMenuItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                color={item.color}
                                onPress={() => handleNavigate(item.screen)}
                            />
                        ))}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowMoreMenu(false)}
                        >
                            <Text style={styles.closeButtonText}>Kapat</Text>
                        </TouchableOpacity>
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
        color: Colors.TEXT_PRIMARY,
        marginBottom: Spacing.md,
    },
    actionsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.CARD,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        ...Shadows.sm,
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
        color: Colors.TEXT_PRIMARY,
        marginTop: Spacing.xs,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.OVERLAY,
        justifyContent: "flex-end",
    },
    menuContainer: {
        backgroundColor: Colors.BACKGROUND,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.lg,
        paddingBottom: Spacing["2xl"],
    },
    menuHandle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.GRAY_300,
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: Spacing.lg,
    },
    menuTitle: {
        ...TextStyles.h4,
        color: Colors.TEXT_PRIMARY,
        marginBottom: Spacing.md,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER,
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
        color: Colors.TEXT_PRIMARY,
        flex: 1,
    },
    closeButton: {
        backgroundColor: Colors.SURFACE,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: "center",
        marginTop: Spacing.lg,
    },
    closeButtonText: {
        ...TextStyles.labelLarge,
        color: Colors.TEXT_SECONDARY,
    },
});

export default QuickActions;
