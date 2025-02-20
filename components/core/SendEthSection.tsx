import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useWallet } from "@/lib/hooks/useWallet";
import { sendEthToAAWallet } from "@/lib/services/contracts";

interface SendEthSectionProps {
  aaWalletAddress: string;
}

export const SendEthSection = ({ aaWalletAddress }: SendEthSectionProps) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signer } = useWallet();

  const handleSendEth = async () => {
    try {
      setLoading(true);
      setError("");

      if (!signer) {
        throw new Error("Wallet not connected");
      }

      if (!signer.provider) {
        throw new Error("No provider available");
      }

      await sendEthToAAWallet(signer, aaWalletAddress, amount);
      setAmount("");
      // React Native'de window.location.reload() yerine
      // Alternatif bir yenileme stratejisi kullanmalısınız
      // Örneğin: navigation.reset() veya bir callback fonksiyonu
    } catch (err) {
      console.error("Error sending ETH:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send ETH. Please try again.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fund Smart Account</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              placeholder="0.0"
              placeholderTextColor="#6B7280"
              keyboardType="decimal-pad"
            />
            <Text style={styles.ethLabel}>ETH</Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSendEth}
          disabled={loading || !amount}
          style={[styles.button, (!amount || loading) && styles.buttonDisabled]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" style={styles.spinner} />
              <Text style={styles.buttonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Send ETH</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F3F4F6",
    marginBottom: 24,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D1D5DB",
    marginBottom: 4,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#404040",
    borderWidth: 1,
    borderColor: "#404040",
    borderRadius: 8,
    position: "relative",
  },
  input: {
    flex: 1,
    padding: 12,
    color: "#F3F4F6",
    fontSize: 16,
  },
  ethLabel: {
    position: "absolute",
    right: 12,
    color: "#D1D5DB",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#404040",
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 8,
  },
});
