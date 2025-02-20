import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { LocalWallet } from '../services/localWallet';
import { RPC_URL } from '../config';
import { getExistingAccount } from '../services/contracts';

export const useWallet = () => {
    const [signer, setSigner] = useState<ethers.Wallet | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);
    const [address, setAddress] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [smartAccountAddress, setSmartAccountAddress] = useState<string>('');
    const [hasAccount, setHasAccount] = useState(false);

    useEffect(() => {
        const initializeWallet = async () => {
            try {
                const localWallet = LocalWallet.getInstance();
                await localWallet.initialize(RPC_URL);
                
                const walletSigner = localWallet.getSigner();
                const walletProvider = localWallet.getProvider();
                const walletAddress = localWallet.getAddress();

                if (!walletSigner || !walletProvider || !walletAddress) {
                    throw new Error('Failed to initialize wallet');
                }

                setSigner(walletSigner);
                setProvider(walletProvider);
                setAddress(walletAddress);

                // Check for existing AA wallet
                const existingAccount = await getExistingAccount(walletSigner);
                if (existingAccount) {
                    setSmartAccountAddress(existingAccount);
                    setHasAccount(true);
                }

                setError('');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(errorMessage);
                console.error('Wallet initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeWallet();
    }, []);

    const disconnectWallet = useCallback(() => {
        setSigner(null);
        setProvider(null);
        setAddress('');
        setSmartAccountAddress('');
        setHasAccount(false);
        setError('');
    }, []);

    return {
        signer,
        provider,
        address,
        error,
        isLoading,
        disconnectWallet,
        smartAccountAddress,
        hasAccount,
        setSmartAccountAddress,
        setHasAccount
    };
}; 