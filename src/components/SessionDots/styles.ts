import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    dot: {
        width: 18,
        height: 18,
        borderRadius: radius.full,
        borderWidth: 2,
        borderColor: colors.border,
    },
    dotDone: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    dotCurrent: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
});
