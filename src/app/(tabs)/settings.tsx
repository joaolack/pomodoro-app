import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { DEFAULT_SETTINGS } from '@/constants/defaults';
import { useAppData } from '@/context/app-data';
import { colors, spacing } from '@/theme';
import type { Settings } from '@/types/settings';
import {
    SETTINGS_LIMITS,
    formToSettings,
    settingsToForm,
    validateSettings,
    type SettingsErrors,
    type SettingsForm,
    type SettingsKey,
} from '@/utils/settings';

const FIELDS: { key: SettingsKey; label: string; unit: string }[] = [
    { key: 'focusMinutes', label: 'Foco', unit: 'minutos' },
    { key: 'shortBreakMinutes', label: 'Pausa curta', unit: 'minutos' },
    { key: 'longBreakMinutes', label: 'Pausa longa', unit: 'minutos' },
    { key: 'sessionsUntilLongBreak', label: 'Sessões até a pausa longa', unit: 'sessões' },
];

export default function SettingsScreen() {
    const { isLoaded, settings, updateSettings } = useAppData();

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {isLoaded ? (
                <SettingsFormView initialSettings={settings} onSave={updateSettings} />
            ) : (
                <Text style={styles.loading}>Carregando...</Text>
            )}
        </SafeAreaView>
    );
}

type SettingsFormViewProps = {
    initialSettings: Settings;
    onSave: (settings: Settings) => void;
};

function SettingsFormView({ initialSettings, onSave }: SettingsFormViewProps) {
    const [form, setForm] = useState<SettingsForm>(() => settingsToForm(initialSettings));
    const [errors, setErrors] = useState<SettingsErrors>({});
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    function handleChange(key: SettingsKey, text: string) {
        setForm((prev) => ({ ...prev, [key]: text }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
        setSavedMessage(null);
    }

    function handleSave() {
        const newErrors = validateSettings(form);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setSavedMessage(null);
            return;
        }

        onSave(formToSettings(form));
        setSavedMessage('Configurações salvas.');
    }

    function handleRestoreDefaults() {
        setForm(settingsToForm(DEFAULT_SETTINGS));
        setErrors({});
        setSavedMessage('Valores padrão restaurados. Toque em Salvar para aplicar.');
    }

    return (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Configurações</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tempos</Text>

                {FIELDS.map(({ key, label, unit }) => (
                    <TextField
                        key={key}
                        label={label}
                        value={form[key]}
                        onChangeText={(text) => handleChange(key, text)}
                        error={errors[key]}
                        description={`Entre ${SETTINGS_LIMITS[key].min} e ${SETTINGS_LIMITS[key].max} ${unit}.`}
                        keyboardType="number-pad"
                        maxLength={2}
                    />
                ))}
            </View>

            {savedMessage ? <Text style={styles.saved}>{savedMessage}</Text> : null}

            <View style={styles.actions}>
                <Button title="Salvar" onPress={handleSave} />
                <Button title="Restaurar padrão" variant="outline" onPress={handleRestoreDefaults} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loading: {
        marginTop: spacing.xl,
        textAlign: 'center',
        color: colors.textMuted,
    },
    content: {
        gap: spacing.xl,
        padding: spacing.lg,
        paddingBottom: spacing.xxl * 2,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
    },
    section: {
        gap: spacing.md,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    saved: {
        color: colors.primary,
        fontWeight: '600',
    },
    actions: {
        gap: spacing.sm,
    },
});
