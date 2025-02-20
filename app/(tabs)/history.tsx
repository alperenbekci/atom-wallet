import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useWallet } from "@/lib/hooks/useWallet";
import { WalletCard } from "@/components/core/WalletCard";
import {
  getTransactionHistory,
  Transaction,
} from "@/lib/services/transactions";

export default function HistoryPage() {
  const { smartAccountAddress, signer } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = useCallback(
    async (showLoading = true) => {
      if (!smartAccountAddress || !signer?.provider) {
        setTransactions([]);
        setError("");
        return;
      }

      try {
        if (showLoading) setLoading(true);
        setError("");

        const txHistory = await getTransactionHistory(
          smartAccountAddress,
          signer.provider
        );
        setTransactions(txHistory);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [smartAccountAddress, signer]
  );

  useEffect(() => {
    if (smartAccountAddress && signer?.provider) {
      fetchTransactions();
    }
  }, [smartAccountAddress, signer]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions(false);
  };

  if (!smartAccountAddress || !signer?.provider) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <WalletCard type="smart" />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Connect your wallet to view transactions
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2196F3"
            colors={["#2196F3"]}
          />
        }
      >
        <WalletCard type="smart" />

        <View style={styles.transactionsContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Transaction History</Text>
            {!loading && !refreshing && (
              <TouchableOpacity onPress={handleRefresh}>
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchTransactions()}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map((tx) => (
                <View key={tx.hash} style={styles.transactionCard}>
                  <View style={styles.transactionHeader}>
                    <Text style={styles.transactionHash} numberOfLines={1}>
                      {tx.hash}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.transactionDetails}>
                    <View style={styles.addressContainer}>
                      <Text style={styles.label}>From</Text>
                      <View style={styles.addressRow}>
                        <Text
                          style={[
                            styles.address,
                            tx.from.toLowerCase() ===
                              smartAccountAddress?.toLowerCase() &&
                              styles.highlightedAddress,
                          ]}
                          numberOfLines={1}
                        >
                          {tx.from}
                        </Text>
                        {tx.from.toLowerCase() ===
                          smartAccountAddress?.toLowerCase() && (
                          <Text style={styles.directionBadge}>SENT</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.addressContainer}>
                      <Text style={styles.label}>To</Text>
                      <View style={styles.addressRow}>
                        <Text
                          style={[
                            styles.address,
                            tx.to.toLowerCase() ===
                              smartAccountAddress?.toLowerCase() &&
                              styles.highlightedAddress,
                          ]}
                          numberOfLines={1}
                        >
                          {tx.to}
                        </Text>
                        {tx.to.toLowerCase() ===
                          smartAccountAddress?.toLowerCase() && (
                          <Text style={styles.directionBadge}>RECEIVED</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.valueContainer}>
                      <Text style={styles.label}>Value</Text>
                      <Text
                        style={[
                          styles.value,
                          tx.from.toLowerCase() ===
                          smartAccountAddress?.toLowerCase()
                            ? styles.sentValue
                            : styles.receivedValue,
                        ]}
                      >
                        {tx.value} ETH
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
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
  transactionsContainer: {
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  refreshText: {
    color: "#2196F3",
    fontSize: 14,
  },
  refreshingText: {
    opacity: 0.5,
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    opacity: 0.7,
    marginTop: 8,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#FF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    color: "#FFFFFF",
    opacity: 0.5,
    fontSize: 16,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: "#262626",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transactionHash: {
    color: "#2196F3",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  transactionDate: {
    color: "#FFFFFF",
    opacity: 0.5,
    fontSize: 12,
  },
  transactionDetails: {
    gap: 12,
  },
  addressContainer: {
    gap: 4,
  },
  label: {
    color: "#FFFFFF",
    opacity: 0.5,
    fontSize: 12,
  },
  address: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  valueContainer: {
    gap: 4,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  highlightedAddress: {
    color: "#2196F3",
  },
  directionBadge: {
    fontSize: 10,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sentValue: {
    color: "#FF4444",
  },
  receivedValue: {
    color: "#4CAF50",
  },
});
