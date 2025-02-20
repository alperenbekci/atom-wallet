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
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <WalletCard type="smart" />

        <View style={styles.navigationContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/batch")}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="apps" size={28} color="#2196F3" />
              </View>
              <Text style={styles.navButtonText}>Batch</Text>
              <Text style={styles.navButtonSubText}>Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/fund")}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="wallet" size={28} color="#2196F3" />
              </View>
              <Text style={styles.navButtonText}>Fund</Text>
              <Text style={styles.navButtonSubText}>Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/paymaster")}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="settings" size={28} color="#2196F3" />
              </View>
              <Text style={styles.navButtonText}>Paymaster</Text>
              <Text style={styles.navButtonSubText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  navButtonText: {
    color: "#F3F4F6",
    fontSize: 14,
    fontWeight: "600",
  },
  navButtonSubText: {
    color: "#F3F4F6",
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
});
