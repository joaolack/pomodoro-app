import { Text, View } from 'react-native';

import type { DayStats } from '@/utils/sessions';
import { styles } from './styles';

const MAX_BAR_HEIGHT = 120;

type WeeklyChartProps = {
    days: DayStats[];
};

export function WeeklyChart({ days }: WeeklyChartProps) {
    const maxMinutes = Math.max(...days.map((day) => day.minutes));

    return (
        <View style={styles.chart}>
            {days.map((day) => {
                const isBest = maxMinutes > 0 && day.minutes === maxMinutes;
                const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * MAX_BAR_HEIGHT : 0;

                return (
                    <View key={day.dayKey} style={styles.column}>
                        <Text style={styles.value}>{day.minutes > 0 ? day.minutes : ''}</Text>

                        <View style={[styles.track, { height: MAX_BAR_HEIGHT }]}>
                            <View
                                style={[
                                    styles.bar,
                                    isBest && styles.barBest,
                                    { height: Math.max(height, day.minutes > 0 ? 4 : 0) },
                                ]}
                            />
                        </View>

                        <Text style={[styles.label, day.isToday && styles.labelToday]}>{day.label}</Text>
                    </View>
                );
            })}
        </View>
    );
}
