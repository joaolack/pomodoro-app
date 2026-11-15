import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { TaskCard } from '@/components/TaskCard';
import { TextField } from '@/components/TextField';
import { MASCOT } from '@/constants/mascot';
import { useAppData } from '@/context/app-data';
import { colors, spacing } from '@/theme';
import { TASK_TITLE_MAX_LENGTH, validateTaskTitle } from '@/utils/tasks';

export default function TasksScreen() {
    const { tasks, addTask, toggleTask, removeTask, selectedTaskId, selectTask } = useAppData();
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    function handleChangeTitle(text: string) {
        setTitle(text);
        if (error) setError(null);
    }

    function handleAdd() {
        const validationError = validateTaskTitle(title, tasks);
        if (validationError) {
            setError(validationError);
            return;
        }

        addTask(title);
        setTitle('');
    }

    function handleSelect(id: string) {
        selectTask(selectedTaskId === id ? null : id);
        router.back();
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextField
                    label="Nova tarefa"
                    placeholder="Ex.: Estudar React"
                    value={title}
                    onChangeText={handleChangeTitle}
                    error={error ?? undefined}
                    maxLength={TASK_TITLE_MAX_LENGTH}
                    returnKeyType="done"
                    onSubmitEditing={handleAdd}
                />
                <Button title="Adicionar" onPress={handleAdd} />
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(task) => task.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TaskCard
                        task={item}
                        isSelected={item.id === selectedTaskId}
                        onSelect={() => handleSelect(item.id)}
                        onToggle={() => toggleTask(item.id)}
                        onRemove={() => removeTask(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Image source={MASCOT.hello} style={styles.emptyMascot} contentFit="contain" accessible={false} />
                        <Text style={styles.empty}>Oi! Nenhuma tarefa ainda. Adicione a primeira acima.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    form: {
        gap: spacing.md,
        padding: spacing.lg,
    },
    list: {
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    emptyState: {
        alignItems: 'center',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    emptyMascot: {
        width: 160,
        height: 160,
    },
    empty: {
        textAlign: 'center',
        color: colors.textMuted,
    },
});
