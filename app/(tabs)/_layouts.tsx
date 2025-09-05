import { Tabs } from "expo-router";
import { Home, History, User, Users } from "lucide-react-native";
import React from "react";
import { useAppStore } from '@/store/app-store';

import Colors from "@/constants/colors";

export default function TabLayout() {
  const { user } = useAppStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: user.role === 'agent' ? "Missions" : user.role === 'admin' ? "Dashboard" : "Accueil",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: user.role === 'admin' ? "Rapports" : "Historique",
          tabBarIcon: ({ color }) => <History color={color} size={24} />,
        }}
      />
      {user.role === 'admin' && (
        <Tabs.Screen
          name="admin-panel"
          options={{
            title: "Gestion",
            tabBarIcon: ({ color }) => <Users color={color} size={24} />,
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}