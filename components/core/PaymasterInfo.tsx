import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ethers } from "ethers";
import { getPaymaster } from "@/lib/services/paymaster";
import { getEntryPoint } from "@/lib/services/contracts";
import { usePaymasterStore } from "@/lib/store";
import { useWallet } from "@/lib/hooks/useWallet";
import { PAYMASTER_ADDRESS } from "@/lib/config";

export const PaymasterInfo = () => {
  const [deposit, setDeposit] = useState<string>("0");
  const [stake, setStake] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { usePaymaster, togglePaymaster } = usePaymasterStore();
  const { signer } = useWallet();

  const fetchPaymasterInfo = async () => {
    if (!signer || !signer.provider) {
      setLoading(false);
      return;
    }

    try {
      setError("");

      const paymaster = getPaymaster(signer);
      const entryPoint = getEntryPoint(signer);

      const depositBN = await paymaster.getDeposit();
      setDeposit(ethers.utils.formatEther(depositBN));

      const stakeInfo = await entryPoint.getDepositInfo(PAYMASTER_ADDRESS);
      setStake(ethers.utils.formatEther(stakeInfo.stake));
    } catch (error) {
      console.error("Error fetching paymaster info:", error);
      setError("Failed to fetch paymaster info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymasterInfo();
    const interval = setInterval(fetchPaymasterInfo, 5000);
    return () => clearInterval(interval);
  }, [signer]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paymaster Info</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>
            {usePaymaster ? "Paymaster Enabled" : "Paymaster Disabled"}
          </Text>
          <TouchableOpacity
            style={[styles.switch, usePaymaster && styles.switchActive]}
            onPress={togglePaymaster}
          >
            <View
              style={[
                styles.switchKnob,
                usePaymaster && styles.switchKnobActive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Deposit</Text>
            <Text style={styles.value}>{deposit} ETH</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Stake</Text>
            <Text style={styles.value}>{stake} ETH</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.7,
  },
  switch: {
    width: 36,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 2,
  },
  switchActive: {
    backgroundColor: "#2196F3",
  },
  switchKnob: {
    width: 16,
    height: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    transform: [{ translateX: 0 }],
  },
  switchKnobActive: {
    transform: [{ translateX: 16 }],
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
  },
  infoContainer: {
    gap: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
