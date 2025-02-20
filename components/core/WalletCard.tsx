import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export interface WalletCardProps {
  label: string;
  address: string;
  balance: string;
  showCopy?: boolean;
}

export const WalletCard = ({ label, address, balance, showCopy = true }: WalletCardProps) => {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(address);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              {parseFloat(balance).toFixed(4)}
            </Text>
            <Text style={styles.ethText}>ETH</Text>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
              {address}
            </Text>
            {showCopy && (
              <TouchableOpacity
                onPress={handleCopy}
                style={styles.copyButton}
              >
                <CopyIcon />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// Copy ikonu komponenti
const CopyIcon = () => (
  <View style={styles.iconContainer}>
    {/* SVG yerine basit bir ikon temsili */}
    <View style={styles.copyIconBox} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2563EB', // blue-600
    borderRadius: 16,
    padding: 4,
    overflow: 'hidden',
  },
  innerContainer: {
    backgroundColor: '#111827', // gray-900
    borderRadius: 12,
    padding: 24,
    height: '100%',
  },
  contentContainer: {
    gap: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB', // gray-300
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399', // green-400
    opacity: 0.8,
  },
  statusText: {
    fontSize: 14,
    color: '#D1D5DB', // gray-300
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  balanceText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F3F4F6', // gray-100
  },
  ethText: {
    color: '#D1D5DB', // gray-300
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#D1D5DB', // gray-300
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
  },
  iconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyIconBox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 2,
  },
});