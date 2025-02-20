import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useWallet } from '@/lib/hooks/useWallet';
import { checkAndCreateAccount, updateBalances, sendBatchTransactions, sendSingleTransaction } from '@/lib/services/wallet';
import { PaymasterInfo } from '@/components/core/PaymasterInfo';
import { WalletCard } from '@/components/core/WalletCard';
import { TabButton } from '@/components/core/TabButton';
import { SingleTransactionForm } from '@/components/core/SingleTransactionForm';
import { DualTransactionForm } from '@/components/core/DualTransactionForm';
import { SendEthSection } from '@/components/core/SendEthSection';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eoaBalance, setEoaBalance] = useState('0');
  const [aaBalance, setAaBalance] = useState('0');
  const [txLoading, setTxLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('fund'); // 'fund' | 'single' | 'batch'
  const { signer, address, isLoading, smartAccountAddress, hasAccount, setSmartAccountAddress, setHasAccount } = useWallet();

  const refreshBalances = async () => {
    if (signer && smartAccountAddress) {
      try {
        const { eoaBalance: eoa, aaBalance: aa } = await updateBalances(signer, smartAccountAddress);
        setEoaBalance(eoa);
        setAaBalance(aa);
      } catch (error) {
        console.error('Error updating balances:', error);
      }
    }
  };

  useEffect(() => {
    if (signer && smartAccountAddress) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 5000);
      return () => clearInterval(interval);
    }
  }, [signer, smartAccountAddress]);

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      setError('');
      if (!signer) throw new Error('Wallet not initialized');

      const { accountAddress: newAccountAddress } = await checkAndCreateAccount(signer);
      
      // Smart account adresini ve durumunu güncelle
      if (newAccountAddress) {
        setSmartAccountAddress(newAccountAddress);
        setHasAccount(true);
        
        // Bakiyeleri güncelle
        const { eoaBalance: eoa, aaBalance: aa } = await updateBalances(signer, newAccountAddress);
        setEoaBalance(eoa);
        setAaBalance(aa);
      } else {
        throw new Error('Failed to create or get account address');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBatchTransactions = async (recipients: string[], amounts: string[]) => {
    try {
      setTxLoading(true);
      setError('');
      if (!signer) throw new Error('Wallet not initialized');

      const receipt = await sendBatchTransactions(signer, smartAccountAddress, recipients, amounts);
      console.log('Batch transaction sent:', receipt);

      const { eoaBalance: eoa, aaBalance: aa } = await updateBalances(signer, smartAccountAddress);
      setEoaBalance(eoa);
      setAaBalance(aa);
    } catch (err) {
      setError('Failed to send transactions');
      console.error(err);
    } finally {
      setTxLoading(false);
    }
  };

  const handleSendSingleTransaction = async (recipient: string, amount: string) => {
    try {
      setTxLoading(true);
      setError('');
      if (!signer) throw new Error('Wallet not initialized');

      const receipt = await sendSingleTransaction(signer, smartAccountAddress, recipient, amount);
      console.log('Transaction sent:', receipt);

      const { eoaBalance: eoa, aaBalance: aa } = await updateBalances(signer, smartAccountAddress);
      setEoaBalance(eoa);
      setAaBalance(aa);
    } catch (err) {
      setError('Failed to send transaction');
      console.error(err);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Smart Account Wallet</Text>
          <Text style={styles.subtitle}>Powered by Account Abstraction</Text>
        </View>
        
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading wallet...</Text>
          </View>
        ) : !address ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Failed to load wallet</Text>
          </View>
        ) : (
          <View style={styles.mainContent}>
            <View style={styles.walletsContainer}>
              <WalletCard label="EOA Wallet" address={address} balance={eoaBalance} />
              {hasAccount && (
                <WalletCard label="Smart Account" address={smartAccountAddress} balance={aaBalance} />
              )}
            </View>

            {!hasAccount ? (
              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  onPress={handleCreateAccount}
                  disabled={loading}
                  style={[styles.button, loading ? styles.buttonDisabled : styles.buttonEnabled]}
                >
                  {loading ? (
                    <View style={styles.buttonContent}>
                      <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                      <Text style={styles.buttonText}>Creating...</Text>
                    </View>
                  ) : (
                    <Text style={styles.buttonText}>Create Smart Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.tabSection}>
                <View style={styles.tabButtons}>
                  <TabButton active={activeTab === 'fund'} onPress={() => setActiveTab('fund')}>
                    <Text style={styles.tabButtonText}>Fund Account</Text>
                  </TabButton>
                  <TabButton active={activeTab === 'single'} onPress={() => setActiveTab('single')}>
                    <Text style={styles.tabButtonText}>Single Transaction</Text>
                  </TabButton>
                  <TabButton active={activeTab === 'batch'} onPress={() => setActiveTab('batch')}>
                    <Text style={styles.tabButtonText}>Batch Transactions</Text>
                  </TabButton>
                </View>
                <View style={styles.tabContent}>
                  {activeTab === 'fund' && (
                    <SendEthSection aaWalletAddress={smartAccountAddress} />
                  )}
                  {activeTab === 'single' && (
                    <SingleTransactionForm onSubmit={handleSendSingleTransaction} loading={txLoading} />
                  )}
                  {activeTab === 'batch' && (
                    <DualTransactionForm onSubmit={handleSendBatchTransactions} loading={txLoading} />
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        ) : null}

        <PaymasterInfo />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717', // bg-gray-950
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f3f4f6', // text-gray-100
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af', // text-gray-400
  },
  centered: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#d1d5db', // text-gray-300
  },
  errorText: {
    color: '#f87171', // text-red-400
  },
  mainContent: {
    marginBottom: 24,
  },
  walletsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  buttonWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonEnabled: {
    backgroundColor: '#2563eb',
  },
  buttonDisabled: {
    backgroundColor: '#374151',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  tabSection: {
    backgroundColor: '#1f2937', // gray-900
    borderRadius: 16,
    padding: 16,
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tabContent: {
    // Ek stil düzenlemeleri yapılabilir
  },
  errorBox: {
    padding: 16,
    backgroundColor: '#1f2937', // gray-800
    borderWidth: 1,
    borderColor: '#f87171',
    borderRadius: 12,
    marginBottom: 16,
  },
  errorBoxText: {
    color: '#f87171',
    fontSize: 14,
  },
});
