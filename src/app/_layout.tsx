import { AppDataProvider } from "@/context/app-data";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AppDataProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }}/>
      </Stack>
    </AppDataProvider>  
  );
}