import type { Task } from '@/types/task';

export const TASK_TITLE_MAX_LENGTH = 60;

export function validateTaskTitle(title: string, tasks: Task[]): string | null {
    const trimmed = title.trim();

    if (trimmed === '') {
        return 'Digite o nome da tarefa.';
    }

    if (trimmed.length > TASK_TITLE_MAX_LENGTH) {
        return `Use no máximo ${TASK_TITLE_MAX_LENGTH} caracteres.`;
    }

    const alreadyExists = tasks.some(
        (task) => task.title.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
        return 'Essa tarefa já existe.';
    }

    return null;
}
