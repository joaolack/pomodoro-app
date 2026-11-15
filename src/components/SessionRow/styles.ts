import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    time: {
        width: 48,
        fontSize: 14,
        color: colors.textMuted,
        fontVariant: ['tabular-nums'],
    },
    task: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
    },
    minutes: {
        fontSize: 14,
        color: colors.textMuted,
    },
});
