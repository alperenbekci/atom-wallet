import React from "react";
import { View, StyleSheet } from "react-native";
import { SendEthSection } from "@/components/core/SendEthSection";
import { useWallet } from "@/lib/hooks/useWallet";
import { WalletCard } from "@/components/core/WalletCard";
import { Stack } from "expo-router";

export default function FundPage() {
  const { address, smartAccountAddress } = useWallet();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Fund Account",
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
      <WalletCard type="eoa" />
      <View style={styles.section}>
        <SendEthSection aaWalletAddress={smartAccountAddress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
    padding: 16,
  },
  section: {
    marginVertical: 8,
  },
});
