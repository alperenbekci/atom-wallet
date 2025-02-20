import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ethers } from 'ethers';
import { getPaymaster } from '@/lib/services/paymaster';
import { getEntryPoint } from '@/lib/services/contracts';
import { usePaymasterStore } from '@/lib/store';
import { useWallet } from '@/lib/hooks/useWallet';
import { PAYMASTER_ADDRESS } from '@/lib/config';
import { Switch } from 'react-native-gesture-handler';

export const PaymasterInfo = () => {
    const [deposit, setDeposit] = useState<string>('0');
    const [stake, setStake] = useState<string>('0');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const { usePaymaster, togglePaymaster } = usePaymasterStore();
    const { signer } = useWallet();

    const fetchPaymasterInfo = async () => {
        if (!signer || !signer.provider) {
            setLoading(false);
            return;
        }

        try {
            setError('');

            const paymaster = getPaymaster(signer);
            const entryPoint = getEntryPoint(signer);

            const depositBN = await paymaster.getDeposit();
            setDeposit(ethers.utils.formatEther(depositBN));

            const stakeInfo = await entryPoint.getDepositInfo(PAYMASTER_ADDRESS);
            setStake(ethers.utils.formatEther(stakeInfo.stake));
        } catch (error) {
            console.error('Error fetching paymaster info:', error);
            setError('Failed to fetch paymaster info');
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
                        {usePaymaster ? 'Paymaster Enabled' : 'Paymaster Disabled'}
                    </Text>
                    <Switch
                        value={usePaymaster}
                        onValueChange={togglePaymaster}
                        trackColor={{ false: '#374151', true: '#2563EB' }}
                        thumbColor="#FFFFFF"
                    />
                </View>
            </View>
            
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563EB" />
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
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F3F4F6',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        fontSize: 14,
        color: '#D1D5DB',
        marginRight: 12,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#EF4444',
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
        color: '#9CA3AF',
        marginBottom: 4,
    },
    value: {
        fontSize: 20,
        fontWeight: '600',
        color: '#F3F4F6',
    },
});