import type { SessionType } from "@/types/session";
import type { Settings } from "@/types/settings";

const MS_PER_MINUTE = 60 * 1000;

export function formatTime(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getNextMode(
    current: SessionType,
    completedFocus: number,
    sessionsUntilLongBreak: number,
): SessionType {
    if (current !== 'focus') {
        return 'focus';
    }

    if (completedFocus % sessionsUntilLongBreak === 0) {
        return 'longBreak';
    }

    return 'shortBreak';   
}

const MODE_LABELS: Record<SessionType, string> = {
    focus: 'Foco',
    shortBreak: 'Pausa curta',
    longBreak: 'Pausa longa',
};

export function getModeLabel(mode: SessionType): string {
    return MODE_LABELS[mode];
}

export function getCycleProgress(
    mode: SessionType,
    completedFocus: number,
    sessionsUntilLongBreak: number,
): number {
    const doneInCycle = completedFocus % sessionsUntilLongBreak;

    if (mode === 'longBreak' && completedFocus > 0 && doneInCycle === 0) {
        return sessionsUntilLongBreak;
    }

    return doneInCycle;
}

export function getModeMinutes(mode: SessionType, settings: Settings): number {
    switch (mode) {
        case 'focus':
            return settings.focusMinutes;
        case 'shortBreak':
            return settings.shortBreakMinutes;
        case 'longBreak':
            return settings.longBreakMinutes;
    }
}

export function getModeDurationMs(mode: SessionType, settings: Settings): number {
    return getModeMinutes(mode, settings) * MS_PER_MINUTE;
}