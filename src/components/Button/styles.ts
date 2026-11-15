import { StyleSheet } from "react-native";
import { colors, spacing, radius } from "@/theme";

export const styles = StyleSheet.create({
    base: {
        minHeight: 48,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: colors.primary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
    },
    pressed: {
        opacity: 0.7,
    },
    disabled: {
        opacity: 0.4,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    textPrimary: {
        color: colors.background,
    },
    textOutline: {
        color: colors.text,
    },
});