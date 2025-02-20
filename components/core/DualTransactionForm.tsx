import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

interface DualTransactionFormProps {
  onSubmit: (recipients: string[], amounts: string[]) => void;
  loading: boolean;
}

export const DualTransactionForm = ({ onSubmit, loading }: DualTransactionFormProps) => {
  const [recipient1, setRecipient1] = useState('');
  const [amount1, setAmount1] = useState('');
  const [recipient2, setRecipient2] = useState('');
  const [amount2, setAmount2] = useState('');

  const handleSubmit = () => {
    onSubmit([recipient1, recipient2], [amount1, amount2]);
  };

  const isFormValid = recipient1 && amount1 && recipient2 && amount2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Multiple Transactions</Text>
      
      <View style={styles.transactionsContainer}>
        {/* Transaction 1 */}
        <View style={styles.transactionBox}>
          <Text style={styles.transactionTitle}>Transaction 1</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>To Address</Text>
            <TextInput
              value={recipient1}
              onChangeText={setRecipient1}
              style={styles.input}
              placeholder="0x..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
              <TextInput
                value={amount1}
                onChangeText={setAmount1}
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
              <Text style={styles.ethLabel}>ETH</Text>
            </View>
          </View>
        </View>

        {/* Transaction 2 */}
        <View style={styles.transactionBox}>
          <Text style={styles.transactionTitle}>Transaction 2</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>To Address</Text>
            <TextInput
              value={recipient2}
              onChangeText={setRecipient2}
              style={styles.input}
              placeholder="0x..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
              <TextInput
                value={amount2}
                onChangeText={setAmount2}
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
              <Text style={styles.ethLabel}>ETH</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!isFormValid || loading) && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid || loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" style={styles.spinner} />
            <Text style={styles.buttonText}>Processing Batch...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Send Transactions</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginBottom: 24,
  },
  transactionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  transactionBox: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F4F6',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 8,
    color: '#F3F4F6',
    fontFamily: 'monospace',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ethLabel: {
    position: 'absolute',
    right: 12,
    color: '#D1D5DB',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
});