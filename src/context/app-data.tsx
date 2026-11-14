import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { loadJSON, saveJSON } from "@/storage/storage";
import type { Session } from "@/types/session";
import type { Task } from "@/types/task";

const STORAGE_KEYS = {
    sessions: 'sessions',
    tasks: 'tasks,'
};

type AppData = {
    sessions: Session[];
    addSession: (session: Session) => void;
    tasks: Task[];
    addTask: (title: string) => void;
    toggleTask: (id: string) => void;
    removeTask: (id: string) => void;
    selectedTaskId: string | null;
    selectTask: (id: string | null) => void;
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: {children: ReactNode}) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        Promise.all([
            loadJSON<Session[]>(STORAGE_KEYS.sessions, []),
            loadJSON<Task[]>(STORAGE_KEYS.tasks, []),
        ]).then(([savedSessions, savedTasks]) => {
            setSessions(savedSessions);
            setTasks(savedTasks);
            setIsLoaded(true);
        });
    }, []);


    useEffect(() => {
        if (!isLoaded) return;
        saveJSON(STORAGE_KEYS.sessions, sessions);
    }, [sessions, isLoaded]);


    useEffect(() => {
        if (!isLoaded) return;
        saveJSON(STORAGE_KEYS.tasks, tasks);
    }, [tasks, isLoaded]);


    function addSession(session: Session) {
        setSessions((prev) => [...prev, session]);
    }

    function addTask(title: string) {
        const task: Task = {
            id: Date.now().toString(),
            title: title.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [...prev, task]);
    }

    function toggleTask(id: string) {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }

    function removeTask(id: string) {
        setTasks((prev) => prev.filter((task) => task.id !== id));

        if (selectedTaskId === id) {
            setSelectedTaskId(null);
        }
    }

    function selectTask(id: string | null) {
        setSelectedTaskId(id);
    }

    return (
        <AppDataContext.Provider
            value={{
                sessions,
                addSession,
                tasks,
                addTask,
                toggleTask,
                removeTask,
                selectedTaskId,
                selectTask,
            }}
        >
            {children}
        </AppDataContext.Provider>
    )
}

export function useAppData() {
    const context = useContext(AppDataContext);
    if (!context) throw new Error('useAppData must be used inside AppDataProvider');
    return context;
}