import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#fff" },
            }}
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="index" />
            <Stack.Screen name="trends" />
          </Stack>
        </SafeAreaView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
