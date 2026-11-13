import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { loadJSON, saveJSON } from "@/storage/storage";
import type { Session } from "@/types/session";

const STORAGE_KEY = 'sessions';

type AppData = {
    sessions: Session[];
    addSession: (Session: Session) => void;
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: {children: ReactNode}) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadJSON<Session[]>(STORAGE_KEY, []).then((saved) => {
            setSessions(saved);
            setIsLoaded(true);
        });
    }, []);


    useEffect(() => {
        if (!isLoaded) return;
        saveJSON(STORAGE_KEY, sessions);
    }, [sessions, isLoaded]);

    
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