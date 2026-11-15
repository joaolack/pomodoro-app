import { useEffect, useEffectEvent, useState } from "react";

import { useAppData } from "@/context/app-data";
import type { SessionType } from "@/types/session";
import { getModeDurationMs, getModeMinutes, getNextMode } from "@/utils/time";

type TimerStatus = 'idle' | 'running' | 'paused';

export function useTimer() {
    const [mode, setMode] = useState<SessionType>('focus');
    const [status, setStatus] = useState<TimerStatus>('idle');
    const [endsAt, setEndsAt] = useState<number | null>(null);
    const [remainingMs, setRemainingMs] = useState(0);
    const [completedFocus, setCompletedFocus] = useState(0);
    const [now, setNow] = useState(0);
    const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);

    const { addSession, selectedTaskId, settings } = useAppData();

    // Duração cheia da etapa atual, sempre com as configurações mais recentes
    const fullDurationMs = getModeDurationMs(mode, settings);

    const displayMs =
        status === 'running' && endsAt !== null
            ? Math.max(0, endsAt - now)
            : status === 'paused'
                ? remainingMs
                : fullDurationMs;

    function start() {
        const startedAt = Date.now();
        const durationMs = status === 'paused' ? remainingMs : fullDurationMs;

        setNow(startedAt);
        setEndsAt(startedAt + durationMs);
        setStatus('running');

        if (status === 'idle') {
            setSessionStartedAt(new Date().toISOString());
        }
    }

    function pause() {
        if (endsAt === null) return;
        setRemainingMs(Math.max(0, endsAt - Date.now()));
        setEndsAt(null);
        setStatus('paused');
    }

    function goToMode(next: SessionType) {
        setMode(next);
        setEndsAt(null);
        setStatus('idle');
        setSessionStartedAt(null);
    }

    function reset() {
        goToMode(mode);
    }

    function skip() {
        const next = getNextMode(mode, completedFocus, settings.sessionsUntilLongBreak);
        goToMode(next);
    }

    function finish() {
        const newCompleted = mode === 'focus' ? completedFocus + 1 : completedFocus;
        setCompletedFocus(newCompleted);

        if (mode === 'focus' && sessionStartedAt !== null) {
            addSession({
                id: Date.now().toString(),
                type: mode,
                taskId: selectedTaskId ?? undefined,
                startedAt: sessionStartedAt,
                durationMinutes: getModeMinutes(mode, settings),
            });
        }

        goToMode(getNextMode(mode, newCompleted, settings.sessionsUntilLongBreak));
    }

    const onTick = useEffectEvent(() => {
        if (endsAt === null) return;

        const current = Date.now();
        if (current >= endsAt) {
            finish();
        } else {
            setNow(current);
        }
    });

    useEffect(() => {
        if (status !== 'running') return;

        const id = setInterval(onTick, 250);
        return () => clearInterval(id);
    }, [status]);

    return { mode, status, displayMs, completedFocus, start, pause, reset, skip };
}
