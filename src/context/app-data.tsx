import { createContext, useContext, useState, type ReactNode } from "react";

import type { Session } from "@/types/session";

type AppData = {
    sessions: Session[];
    addSession: (Session: Session) => void;
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: {children: ReactNode}) {
    const [sessions, setSessions] = useState<Session[]>([]);

    function addSession(session: Session) {
        setSessions((prev) => [...prev, session]);
    }

    return (
        <AppDataContext.Provider value={{sessions, addSession}}>
            {children}
        </AppDataContext.Provider>
    );
}

export function useAppData() {
    const context = useContext(AppDataContext);
    if (!context) throw new Error('useAppData must be used inside AppDataProvider');
    return context;
}