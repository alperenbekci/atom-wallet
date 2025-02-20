import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { WalletCard } from "@/components/core/WalletCard";
import { PaymasterInfo } from "@/components/core/PaymasterInfo";

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <WalletCard />

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/fund")}
          >
            <Text style={styles.navButtonText}>Fund Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/single")}
          >
            <Text style={styles.navButtonText}>Single Transaction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/batch")}
          >
            <Text style={styles.navButtonText}>Batch Transactions</Text>
          </TouchableOpacity>
        </View>

        <PaymasterInfo />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161616",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  navigationContainer: {
    gap: 12,
  },
  navButton: {
    backgroundColor: "#262626",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  navButtonText: {
    color: "#F3F4F6",
    fontSize: 16,
    fontWeight: "500",
  },
});
