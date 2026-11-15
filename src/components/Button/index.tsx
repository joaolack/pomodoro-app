import { Pressable, Text } from "react-native";
import { styles } from "./styles";

type ButtonProps = {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline';
    disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
    const isPrimary = variant === 'primary';

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.base,
                isPrimary ? styles.primary : styles.outline,
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}>
            <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textOutline]}>
                {title}
            </Text>
        </Pressable>
    );
}

