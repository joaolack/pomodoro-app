import { Text, View } from 'react-native';

import { styles } from './styles';

type TimerDisplayProps = {
    time: string;
    modeLabel: string;
    isBreak: boolean;
};

export function TimerDisplay({ time, modeLabel, isBreak }: TimerDisplayProps) {
    return (
        <View style={styles.container}>
            <Text style={[styles.mode, isBreak && styles.modeBreak]}>{modeLabel}</Text>
            <Text
                style={styles.time}
                accessibilityRole="timer"
                accessibilityLabel={`${modeLabel}, ${time} restantes`}
            >
                {time}
            </Text>
        </View>
    );
}
