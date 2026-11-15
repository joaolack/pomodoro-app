import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
    },
    secondary: {
        width: 56,
        height: 56,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        backgroundColor: colors.surface,
    },
    primary: {
        width: 80,
        height: 80,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    primaryPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.96 }],
    },
});
