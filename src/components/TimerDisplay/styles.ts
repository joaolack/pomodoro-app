import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: spacing.sm,
    },
    mode: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
        overflow: 'hidden',
        backgroundColor: colors.primarySoft,
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    modeBreak: {
        backgroundColor: colors.surface,
        color: colors.text,
    },
    time: {
        fontSize: 88,
        fontWeight: '700',
        color: colors.text,
        fontVariant: ['tabular-nums'],
        letterSpacing: -2,
    },
});
