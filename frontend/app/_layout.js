import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: "#0e0e0e" }}
            edges={["top", "bottom"]}
          >
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
              <Stack.Screen name="profile" />
              <Stack.Screen name="settingsExport" />

              <Stack.Screen name="add-reading" />
              <Stack.Screen name="history" />
            </Stack>
          </SafeAreaView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
