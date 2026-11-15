import { View } from 'react-native';

import { styles } from './styles';

type SessionDotsProps = {
    total: number;
    done: number;
    currentIndex: number | null;
};

export function SessionDots({ total, done, currentIndex }: SessionDotsProps) {
    const dots = Array.from({ length: total }, (_, index) => index);

    return (
        <View
            style={styles.row}
            accessibilityLabel={`${done} de ${total} pomodoros concluídos neste ciclo`}
        >
            {dots.map((index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        index < done && styles.dotDone,
                        index === currentIndex && styles.dotCurrent,
                    ]}
                />
            ))}
        </View>
    );
}
