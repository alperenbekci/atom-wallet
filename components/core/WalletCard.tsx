import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useWallet } from "@/lib/hooks/useWallet";
import { useState, useEffect } from "react";
import { updateBalances } from "@/lib/services/wallet";

interface WalletCardProps {
  type: "eoa" | "smart";
}

export const WalletCard = ({ type }: WalletCardProps) => {
  const { signer, address, smartAccountAddress } = useWallet();
  const [eoaBalance, setEoaBalance] = useState("0");
  const [aaBalance, setAaBalance] = useState("0");

  const refreshBalances = async () => {
    if (signer && smartAccountAddress) {
      try {
        const { eoaBalance: eoa, aaBalance: aa } = await updateBalances(
          signer,
          smartAccountAddress
        );
        setEoaBalance(eoa);
        setAaBalance(aa);
      } catch (error) {
        console.error("Error updating balances:", error);
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

  const handleCopy = async (addressToCopy: string) => {
    await Clipboard.setStringAsync(addressToCopy);
  };

  const cardData =
    type === "eoa"
      ? { title: "EOA Wallet", balance: eoaBalance, address: address }
      : {
          title: "Smart Account",
          balance: aaBalance,
          address: smartAccountAddress,
        };

  return (
    <ImageBackground
      source={
        type === "eoa"
          ? require("@/assets/images/eoa.png")
          : require("@/assets/images/smart-account.png")
      }
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.label}>{cardData.title}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Connected</Text>
          </View>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>
            {parseFloat(cardData.balance).toFixed(4)}
          </Text>
          <Text style={styles.unitText}>UNIT0</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text
            style={styles.addressText}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {cardData.address}
          </Text>
          <TouchableOpacity
            onPress={() => handleCopy(cardData.address)}
            style={styles.copyButton}
          >
            <CopyIcon />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
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
    width: "100%",
    height: 200,
    marginBottom: 16,
    overflow: "hidden",
  },
  backgroundImage: {
    borderRadius: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.7,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  unitText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.7,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
  },
  addressText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.7,
    flex: 1,
    marginRight: 8,
  },
  copyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 8,
  },
  iconContainer: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  copyIconBox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 2,
    opacity: 0.8,
  },
});
