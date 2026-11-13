import { useEffect, useEffectEvent, useState } from "react";
import type { SessionType } from "@/types/session";
import { getModeDurationMs, getNextMode } from "@/utils/time";
import { DEFAULT_SETTINGS } from "@/constants/defaults";
import { useAppData } from "@/context/app-data";

type TimerStatus = 'idle' | 'running' | 'paused';

export function useTimer() {
    const [mode, setMode] = useState<SessionType>('focus');
    const [status, setStatus] = useState<TimerStatus>('idle');
    const [endsAt, setEndsAt] = useState<number | null>(null);
    const [remainingMs, setRemainingMs] = useState(getModeDurationMs('focus'));
    const [completedFocus, setCompletedFocus] = useState(0);
    const [now, setNow] = useState(0);
    const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);

    const { addSession } = useAppData();

    const displayMs =
        status === 'running' && endsAt !== null
            ? Math.max(0, endsAt - now)
            : remainingMs;

    function start() {
        const startedAt = Date.now();
        setNow(startedAt);
        setEndsAt(startedAt + remainingMs);
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
        setRemainingMs(getModeDurationMs(next));
        setEndsAt(null);
        setStatus('idle');
        setSessionStartedAt(null);
    }

    function reset() {
        goToMode(mode);
    }

    function skip() {
        const next = getNextMode(mode, completedFocus, DEFAULT_SETTINGS.sessionsUntilLongBreak);
        goToMode(next);
    }

   function finish() {
        const newCompleted = mode === 'focus' ? completedFocus + 1 : completedFocus;
        setCompletedFocus(newCompleted);

        if (mode === 'focus' && sessionStartedAt !== null) {
            addSession({
                id: Date.now().toString(),
                type: mode,
                startedAt: sessionStartedAt,
                durationMinutes: DEFAULT_SETTINGS.focusMinutes,
            });
        }

        goToMode(getNextMode(mode, newCompleted, DEFAULT_SETTINGS.sessionsUntilLongBreak));
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

    return { mode, status, displayMs, completedFocus, start, pause, reset, skip};
}