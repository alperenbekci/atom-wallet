import React from "react";
import { View, StyleSheet } from "react-native";
import { SendEthSection } from "@/components/core/SendEthSection";
import { useWallet } from "@/lib/hooks/useWallet";
import { WalletCard } from "@/components/core/WalletCard";

export default function FundPage() {
  const { address, smartAccountAddress } = useWallet();

  return (
    <View style={styles.container}>
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
