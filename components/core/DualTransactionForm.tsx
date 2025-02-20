import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { usePaymasterStore } from "@/lib/store";

interface DualTransactionFormProps {
  onSubmit: (recipients: string[], amounts: string[]) => void;
  loading: boolean;
}

export const DualTransactionForm = ({
  onSubmit,
  loading,
}: DualTransactionFormProps) => {
  const [recipient1, setRecipient1] = useState("");
  const [amount1, setAmount1] = useState("");
  const [recipient2, setRecipient2] = useState("");
  const [amount2, setAmount2] = useState("");
  const { usePaymaster, togglePaymaster } = usePaymasterStore();

  const handleSubmit = () => {
    onSubmit([recipient1, recipient2], [amount1, amount2]);
  };

  const isFormValid = recipient1 && amount1 && recipient2 && amount2;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Custom</Text>
        <View style={styles.paymasterSwitch}>
          <Text style={styles.paymasterText}>enable paymaster</Text>
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

      <View style={styles.formContainer}>
        {/* Transaction 1 */}
        <View style={styles.transactionGroup}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To Address 1</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={recipient1}
                onChangeText={setRecipient1}
                style={styles.input}
                placeholder="0x..."
                placeholderTextColor="#6B7280"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={amount1}
                onChangeText={setAmount1}
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#6B7280"
                keyboardType="decimal-pad"
              />
              <Text style={styles.unitText}>UNIT0</Text>
            </View>
          </View>
        </View>

        {/* Transaction 2 */}
        <View style={styles.transactionGroup}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To Address 2</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={recipient2}
                onChangeText={setRecipient2}
                style={styles.input}
                placeholder="0x..."
                placeholderTextColor="#6B7280"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={amount2}
                onChangeText={setAmount2}
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#6B7280"
                keyboardType="decimal-pad"
              />
              <Text style={styles.unitText}>UNIT0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || loading) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" style={styles.spinner} />
              <Text style={styles.buttonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Send</Text>
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
    padding: 20,
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
  paymasterSwitch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paymasterText: {
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
  formContainer: {
    gap: 24,
  },
  transactionGroup: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.7,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
  },
  unitText: {
    color: "#FFFFFF",
    opacity: 0.5,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2196F3",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    marginRight: 8,
  },
});
