import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    column: {
        flex: 1,
        alignItems: 'center',
        gap: spacing.xs,
    },
    value: {
        fontSize: 11,
        color: colors.textMuted,
        minHeight: 14,
    },
    track: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderTopLeftRadius: radius.sm,
        borderTopRightRadius: radius.sm,
        backgroundColor: colors.primaryMid,
    },
    barBest: {
        backgroundColor: colors.primary,
    },
    label: {
        fontSize: 12,
        color: colors.textMuted,
    },
    labelToday: {
        color: colors.text,
        fontWeight: '700',
    },
});
