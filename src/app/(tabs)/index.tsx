import { Lucide } from '@react-native-vector-icons/lucide';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SessionDots } from '@/components/SessionDots';
import { TimerControls } from '@/components/TimerControls';
import { TimerDisplay } from '@/components/TimerDisplay';
import { MASCOT } from '@/constants/mascot';
import { useAppData } from '@/context/app-data';
import { useTimer } from '@/hooks/use-timer';
import { colors, radius, spacing } from '@/theme';
import { formatTime, getCycleProgress, getModeLabel } from '@/utils/time';

export default function TimerScreen() {
    const { mode, status, displayMs, start, pause, reset, skip, completedFocus } = useTimer();
    const { tasks, selectedTaskId, settings } = useAppData();

    const selectedTask = tasks.find((task) => task.id === selectedTaskId);
    const isBreak = mode !== 'focus';
    const isRunning = status === 'running';

    const cycleTotal = settings.sessionsUntilLongBreak;
    const cycleDone = getCycleProgress(mode, completedFocus, cycleTotal);

    function getMascot() {
        if (mode === 'shortBreak') return MASCOT.shortBreak;
        if (mode === 'longBreak') return MASCOT.longBreak;
        if (status === 'paused') return MASCOT.distracted;
        return MASCOT.focus;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Image
                    source={getMascot()}
                    style={styles.mascot}
                    contentFit="contain"
                    accessible={false}
                />

                <TimerDisplay time={formatTime(displayMs)} modeLabel={getModeLabel(mode)} isBreak={isBreak} />

                <SessionDots
                    total={cycleTotal}
                    done={cycleDone}
                    currentIndex={mode === 'focus' ? cycleDone : null}
                />

                <TimerControls
                    isRunning={isRunning}
                    onToggle={isRunning ? pause : start}
                    onReset={reset}
                    onSkip={skip}
                />

                <Pressable
                    onPress={() => router.push('/tasks')}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.taskChip, pressed && styles.taskChipPressed]}
                >
                    <Lucide name="list-todo" size={18} color={colors.textMuted} />
                    <Text style={styles.taskText} numberOfLines={1}>
                        {selectedTask ? `Focando em: ${selectedTask.title}` : 'Escolher tarefa'}
                    </Text>
                    <Lucide name="chevron-right" size={18} color={colors.textMuted} />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xl,
        paddingHorizontal: spacing.lg,
    },
    mascot: {
        width: 220,
        height: 220,
        // Lets the mascot shrink on small screens instead of overflowing the column
        flexShrink: 1,
    },
    taskChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        maxWidth: '100%',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.full,
    },
    taskChipPressed: {
        backgroundColor: colors.surface,
    },
    taskText: {
        flexShrink: 1,
        fontSize: 15,
        color: colors.text,
    },
});
