import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

interface SingleTransactionFormProps {
  onSubmit: (recipient: string, amount: string) => void;
  loading: boolean;
}

export const SingleTransactionForm = ({ onSubmit, loading }: SingleTransactionFormProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    onSubmit(recipient, amount);
  };

  const isFormValid = recipient && amount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Single Transaction</Text>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>To Address</Text>
            <TextInput
              value={recipient}
              onChangeText={setRecipient}
              style={styles.input}
              placeholder="0x..."
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

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
              <Text style={styles.buttonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Send Transaction</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginBottom: 24,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 16,
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
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#F3F4F6',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    position: 'relative',
  },
  ethLabel: {
    position: 'absolute',
    right: 12,
    color: '#D1D5DB',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
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