import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
