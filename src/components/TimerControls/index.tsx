import { Lucide } from '@react-native-vector-icons/lucide';
import { Pressable, View } from 'react-native';

import { colors } from '@/theme';
import { styles } from './styles';

type TimerControlsProps = {
    isRunning: boolean;
    onToggle: () => void;
    onReset: () => void;
    onSkip: () => void;
};

export function TimerControls({ isRunning, onToggle, onReset, onSkip }: TimerControlsProps) {
    return (
        <View style={styles.row}>
            <Pressable
                onPress={onReset}
                accessibilityRole="button"
                accessibilityLabel="Reiniciar"
                style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            >
                <Lucide name="rotate-ccw" size={24} color={colors.textMuted} />
            </Pressable>

            <Pressable
                onPress={onToggle}
                accessibilityRole="button"
                accessibilityLabel={isRunning ? 'Pausar' : 'Iniciar'}
                style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}
            >
                <Lucide name={isRunning ? 'pause' : 'play'} size={32} color={colors.background} />
            </Pressable>

            <Pressable
                onPress={onSkip}
                accessibilityRole="button"
                accessibilityLabel="Pular etapa"
                style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            >
                <Lucide name="skip-forward" size={24} color={colors.textMuted} />
            </Pressable>
        </View>
    );
}
