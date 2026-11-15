import type { Session } from '@/types/session';
import type { Task } from '@/types/task';

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export type DayStats = {
    dayKey: string;
    label: string;
    minutes: number;
    isToday: boolean;
};

function pad(value: number): string {
    return String(value).padStart(2, '0');
}


export function toDayKey(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}


export function formatClock(iso: string): string {
    const date = new Date(iso);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addDays(date: Date, amount: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + amount);
    return copy;
}

export function formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h${pad(minutes)}`;
}

export function getTaskLabel(session: Session, tasks: Task[]): string {
    if (!session.taskId) return 'Sem tarefa';

    const task = tasks.find((t) => t.id === session.taskId);
    return task ? task.title : 'Tarefa excluída';
}

export function getFocusSessions(sessions: Session[]): Session[] {
    return sessions.filter((session) => session.type === 'focus');
}

function getMinutesByDay(sessions: Session[]): Record<string, number> {
    const result: Record<string, number> = {};

    for (const session of getFocusSessions(sessions)) {
        const key = toDayKey(new Date(session.startedAt));
        result[key] = (result[key] ?? 0) + session.durationMinutes;
    }

    return result;
}

export function getTodayStats(sessions: Session[], today: Date) {
    const todayKey = toDayKey(today);
    const todaySessions = getFocusSessions(sessions).filter(
        (session) => toDayKey(new Date(session.startedAt)) === todayKey
    );

    return {
        count: todaySessions.length,
        minutes: todaySessions.reduce((sum, session) => sum + session.durationMinutes, 0),
    };
}

export function getLast7Days(sessions: Session[], today: Date): DayStats[] {
    const minutesByDay = getMinutesByDay(sessions);
    const days: DayStats[] = [];

    for (let offset = 6; offset >= 0; offset--) {
        const date = addDays(today, -offset);
        const dayKey = toDayKey(date);
        days.push({
            dayKey,
            label: WEEKDAY_LABELS[date.getDay()],
            minutes: minutesByDay[dayKey] ?? 0,
            isToday: offset === 0,
        });
    }

    return days;
}

export function getStreak(sessions: Session[], today: Date): number {
    const minutesByDay = getMinutesByDay(sessions);
    const hasFocus = (date: Date) => (minutesByDay[toDayKey(date)] ?? 0) > 0;

    let day = hasFocus(today) ? today : addDays(today, -1);
    let streak = 0;

    while (hasFocus(day)) {
        streak++;
        day = addDays(day, -1);
    }

    return streak;
}

export function getRecentSessions(sessions: Session[], limit = 20): Session[] {
    return [...getFocusSessions(sessions)]
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
        .slice(0, limit);
}
