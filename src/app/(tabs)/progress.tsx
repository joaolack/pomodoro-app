import { useAppData } from "@/context/app-data";
import { Text, View, StyleSheet } from "react-native";


export default function ProgressScreen() {
  const { sessions } = useAppData();

  return (
    <View style={styles.container}>
      <Text>Sessões salvas: {sessions.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
