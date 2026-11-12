import { DEFAULT_SETTINGS } from "@/constants/defaults";
import type { SessionType } from "@/types/session";

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

export function getModeDurationMs(mode: SessionType): number {
    const MS_PER_MINUTE = 60 * 1000;

    switch (mode) {
        case 'focus':
            return DEFAULT_SETTINGS.focusMinutes * MS_PER_MINUTE;
        case 'shortBreak':
            return DEFAULT_SETTINGS.shortBreakMinutes * MS_PER_MINUTE;
        case 'longBreak':
            return DEFAULT_SETTINGS.longBreakMinutes * MS_PER_MINUTE;
    }
}