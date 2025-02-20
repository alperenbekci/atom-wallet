import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { DualTransactionForm } from "@/components/core/DualTransactionForm";
import { useWallet } from "@/lib/hooks/useWallet";
import { WalletCard } from "@/components/core/WalletCard";
import { sendBatchTransactions } from "@/lib/services/wallet";
import { Stack } from "expo-router";

export default function BatchTransactionPage() {
  const { signer, smartAccountAddress } = useWallet();
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendBatchTransactions = async (
    recipients: string[],
    amounts: string[]
  ) => {
    try {
      setTxLoading(true);
      setError("");
      if (!signer) throw new Error("Wallet not initialized");

      const receipt = await sendBatchTransactions(
        signer,
        smartAccountAddress,
        recipients,
        amounts
      );
      console.log("Batch transaction sent:", receipt);
    } catch (err) {
      setError("Failed to send transactions");
      console.error(err);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Batch Transaction",
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WalletCard type="smart" />
        <DualTransactionForm
          onSubmit={handleSendBatchTransactions}
          loading={txLoading}
        />
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  errorBox: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
  },
});
