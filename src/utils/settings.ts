import type { Settings } from '@/types/settings';

export type SettingsKey = keyof Settings;
export type SettingsForm = Record<SettingsKey, string>;


export type SettingsErrors = Partial<Record<SettingsKey, string>>;

export const SETTINGS_LIMITS: Record<SettingsKey, { min: number; max: number }> = {
    focusMinutes: { min: 1, max: 60 },
    shortBreakMinutes: { min: 1, max: 60 },
    longBreakMinutes: { min: 1, max: 60 },
    sessionsUntilLongBreak: { min: 1, max: 10 },
};

export function settingsToForm(settings: Settings): SettingsForm {
    return {
        focusMinutes: String(settings.focusMinutes),
        shortBreakMinutes: String(settings.shortBreakMinutes),
        longBreakMinutes: String(settings.longBreakMinutes),
        sessionsUntilLongBreak: String(settings.sessionsUntilLongBreak),
    };
}

function validateField(value: string, key: SettingsKey): string | null {
    const trimmed = value.trim();
    const { min, max } = SETTINGS_LIMITS[key];

    if (trimmed === '') {
        return 'Preencha este campo.';
    }

    if (!/^\d+$/.test(trimmed)) {
        return 'Use apenas números inteiros.';
    }

    const number = Number(trimmed);
    if (number < min || number > max) {
        return `Use um valor entre ${min} e ${max}.`;
    }

    return null;
}

export function validateSettings(form: SettingsForm): SettingsErrors {
    const errors: SettingsErrors = {};

    for (const key of Object.keys(form) as SettingsKey[]) {
        const error = validateField(form[key], key);
        if (error) {
            errors[key] = error;
        }
    }

    return errors;
}

export function formToSettings(form: SettingsForm): Settings {
    return {
        focusMinutes: Number(form.focusMinutes),
        shortBreakMinutes: Number(form.shortBreakMinutes),
        longBreakMinutes: Number(form.longBreakMinutes),
        sessionsUntilLongBreak: Number(form.sessionsUntilLongBreak),
    };
}
