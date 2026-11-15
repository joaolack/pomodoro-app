import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: 56,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        backgroundColor: colors.background,
    },
    cardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: radius.full,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    checkmark: {
        color: colors.background,
        fontSize: 14,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        gap: spacing.xs,
        paddingVertical: spacing.xs,
    },
    title: {
        fontSize: 16,
        color: colors.text,
    },
    titleCompleted: {
        color: colors.textMuted,
        textDecorationLine: 'line-through',
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        color: colors.background,
        fontSize: 12,
        fontWeight: '600',
        overflow: 'hidden',
    },
    remove: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.full,
    },
    pressed: {
        backgroundColor: colors.surface,
    },
    removeText: {
        fontSize: 16,
        color: colors.textMuted,
    },
});
