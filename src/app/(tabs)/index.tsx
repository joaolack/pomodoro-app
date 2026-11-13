import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTimer } from '@/hooks/use-timer';
import { formatTime } from '@/utils/time';

export default function TimerScreen() {
  const { mode, status, displayMs, start, pause, reset, skip, completedFocus } = useTimer();

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(displayMs)}</Text>
      <Text>modo: {mode} · status: {status} · focos: {completedFocus}</Text>

      <Pressable
        style={styles.button}
        onPress={status === 'running' ? pause : start}
      >
        <Text>{status === 'running' ? 'Pausar' : 'Iniciar'}</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={reset}
      >
        <Text>Reiniciar</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={skip}
      >
        <Text>Pular</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  time: { fontSize: 64, fontWeight: '700' },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderRadius: 999 },
});