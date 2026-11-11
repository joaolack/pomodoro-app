export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export type Session = {
    id: string;
    type: SessionType;
    taskId?: string;
    startedAt: string;
    durationMinutes: number;
};