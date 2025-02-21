import React from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import ChatComponent from "@/components/chat/ChatComponent"; // Dosya yolunu projenize göre ayarlayın

export default function ChatPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>AI Chat Assistant</Text>
        <ChatComponent />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // bg-gray-50
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 30, // text-3xl'ye yakın bir boyut
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937", // text-gray-800
    marginBottom: 16,
  },
});
