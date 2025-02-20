import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SingleTransactionForm } from "@/components/core/SingleTransactionForm";
import { useWallet } from "@/lib/hooks/useWallet";
import { WalletCard } from "@/components/core/WalletCard";
import { sendSingleTransaction } from "@/lib/services/wallet";

export default function SingleTransactionPage() {
  const { signer, smartAccountAddress } = useWallet();
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendSingleTransaction = async (
    recipient: string,
    amount: string
  ) => {
    try {
      setTxLoading(true);
      setError("");
      if (!signer) throw new Error("Wallet not initialized");

      const receipt = await sendSingleTransaction(
        signer,
        smartAccountAddress,
        recipient,
        amount
      );
      console.log("Transaction sent:", receipt);
    } catch (err) {
      setError("Failed to send transaction");
      console.error(err);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WalletCard type="smart" />
        <SingleTransactionForm
          onSubmit={handleSendSingleTransaction}
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
