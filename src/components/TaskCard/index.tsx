import { Pressable, Text, View } from 'react-native';

import type { Task } from '@/types/task';
import { styles } from './styles';

type TaskCardProps = {
    task: Task;
    isSelected: boolean;
    onSelect: () => void;
    onToggle: () => void;
    onRemove: () => void;
};

export function TaskCard({ task, isSelected, onSelect, onToggle, onRemove }: TaskCardProps) {
    return (
        <View style={[styles.card, isSelected && styles.cardSelected]}>
            <Pressable
                onPress={onToggle}
                hitSlop={8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.completed }}
                accessibilityLabel={`Concluir ${task.title}`}
                style={[styles.checkbox, task.completed && styles.checkboxChecked]}
            >
                {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
            </Pressable>

            <Pressable onPress={onSelect} style={styles.content}>
                <Text
                    style={[styles.title, task.completed && styles.titleCompleted]}
                    numberOfLines={2}
                >
                    {task.title}
                </Text>
                {isSelected ? <Text style={styles.badge}>Em foco</Text> : null}
            </Pressable>

            <Pressable
                onPress={onRemove}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Remover ${task.title}`}
                style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
            >
                <Text style={styles.removeText}>✕</Text>
            </Pressable>
        </View>
    );
}
