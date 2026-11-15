import { TextInput, Text, View, type TextInputProps } from "react-native";
import type { ComponentRef, Ref } from 'react';
import { colors } from "@/theme";
import { styles } from './styles';


type TextFieldProps = TextInputProps & {
    label: string;
    description?: string;
    error?: string;
    ref?: Ref<ComponentRef<typeof TextInput>>;
};

export function TextField({ label, description, error, style, ref, ...rest}: TextFieldProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                ref={ref}
                style={[styles.input, error ? styles.inputError : null, style]} 
                placeholderTextColor={colors.textMuted}
                {...rest}
            />

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : description ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
        </View>
    );
}