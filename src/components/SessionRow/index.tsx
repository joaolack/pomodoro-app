import { Text, View } from 'react-native';

import { styles } from './styles';

type SessionRowProps = {
    time: string;
    taskLabel: string;
    minutes: number;
};

export function SessionRow({ time, taskLabel, minutes }: SessionRowProps) {
    return (
        <View style={styles.row}>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.task} numberOfLines={1}>
                {taskLabel}
            </Text>
            <Text style={styles.minutes}>{minutes} min</Text>
        </View>
    );
}
