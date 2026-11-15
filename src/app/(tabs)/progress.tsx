import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SessionRow } from '@/components/SessionRow';
import { WeeklyChart } from '@/components/WeeklyChart';
import { MASCOT } from '@/constants/mascot';
import { useAppData } from '@/context/app-data';
import { colors, radius, spacing } from '@/theme';
import {
    formatClock,
    formatMinutes,
    getLast7Days,
    getRecentSessions,
    getStreak,
    getTaskLabel,
    getTodayStats,
} from '@/utils/sessions';

export default function ProgressScreen() {
    const { sessions, tasks, settings } = useAppData();
    const [today] = useState(() => new Date());

    const todayStats = getTodayStats(sessions, today);
    const week = getLast7Days(sessions, today);
    const weekMinutes = week.reduce((sum, day) => sum + day.minutes, 0);
    const streak = getStreak(sessions, today);
    const recentSessions = getRecentSessions(sessions);
    const goalReached = todayStats.count >= settings.sessionsUntilLongBreak;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <FlatList
                data={recentSessions}
                keyExtractor={(session) => session.id}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <View style={styles.titleText}>
                                <Text style={styles.title}>Progresso</Text>
                                <Text style={styles.subtitle}>
                                    {goalReached ? 'Meta do dia batida!' : 'Olha o seu progresso!'}
                                </Text>
                            </View>
                            <Image
                                source={goalReached ? MASCOT.goal : MASCOT.stats}
                                style={styles.mascot}
                                contentFit="contain"
                                accessible={false}
                            />
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Hoje</Text>
                                <Text style={styles.statValue}>{todayStats.count}</Text>
                                <Text style={styles.statHint}>
                                    {todayStats.count === 1 ? 'pomodoro' : 'pomodoros'} · {formatMinutes(todayStats.minutes)}
                                </Text>
                            </View>

                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Sequência</Text>
                                <Text style={styles.statValue}>{streak}</Text>
                                <Text style={styles.statHint}>{streak === 1 ? 'dia seguido' : 'dias seguidos'}</Text>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.sectionTitle}>Últimos 7 dias</Text>
                                <Text style={styles.cardHint}>{formatMinutes(weekMinutes)} de foco</Text>
                            </View>
                            <WeeklyChart days={week} />
                        </View>

                        <Text style={styles.sectionTitle}>Sessões recentes</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <SessionRow
                        time={formatClock(item.startedAt)}
                        taskLabel={getTaskLabel(item, tasks)}
                        minutes={item.durationMinutes}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        Nenhuma sessão ainda. Complete um pomodoro no Timer para ver seu progresso aqui.
                    </Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl * 2,
    },
    header: {
        gap: spacing.lg,
        marginBottom: spacing.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    titleText: {
        flex: 1,
        gap: spacing.xs,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textMuted,
    },
    mascot: {
        width: 120,
        height: 120,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    statCard: {
        flex: 1,
        gap: spacing.xs,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.primarySoft,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
        fontVariant: ['tabular-nums'],
    },
    statHint: {
        fontSize: 13,
        color: colors.textMuted,
    },
    card: {
        gap: spacing.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    cardHint: {
        fontSize: 13,
        color: colors.textMuted,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    empty: {
        marginTop: spacing.md,
        color: colors.textMuted,
        lineHeight: 20,
    },
});
