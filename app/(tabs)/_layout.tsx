import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
        tabBarStyle: {
          backgroundColor: "#262626",
          borderTopWidth: 1,
          borderTopColor: "#262626",
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: "#161616",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fund"
        options={{
          title: "Fund",
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="single"
        options={{
          title: "Send",
          tabBarIcon: ({ color }) => (
            <Ionicons name="arrow-forward-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="batch"
        options={{
          title: "Custom",
          tabBarIcon: ({ color }) => (
            <Ionicons name="apps-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
