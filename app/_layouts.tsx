import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppStore } from '@/store/app-store';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="agent-login" options={{ title: "Connexion Agent", presentation: "modal" }} />
      <Stack.Screen name="admin-login" options={{ title: "Connexion Admin", presentation: "modal" }} />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: "modal",
          title: "Modal"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  const { loadPersistedData } = useAppStore();

  useEffect(() => {
    const initializeApp = async () => {
      await loadPersistedData();
      SplashScreen.hideAsync();
    };
    initializeApp();
  }, [loadPersistedData]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}