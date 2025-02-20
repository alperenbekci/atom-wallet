import React from "react";
import { View, StyleSheet } from "react-native";
import { PaymasterInfo } from "@/components/core/PaymasterInfo";
import { Stack } from "expo-router";

export default function PaymasterPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Paymaster Settings",
          headerStyle: {
            backgroundColor: "#161616",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
          },
        }}
      />
      <PaymasterInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
    padding: 16,
  },
});
