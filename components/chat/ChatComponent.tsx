import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { useMessages } from "@/lib/hooks/useMessages"; // Gerekirse import yolunu düzenleyin
import { TransactionAgent } from "@/lib/agents/TransactionAgent"; // Gerekirse import yolunu düzenleyin

// Mesaj içeriğini Buffer'a dönüştür
const encodeMessage = (content) => {
  return Buffer.from(content, "utf-8");
};

// Buffer'dan mesaj içeriğini çöz
const decodeMessage = (buffer) => {
  return buffer.toString("utf-8");
};

const ChatComponent = ({ signer, accountAddress, onTransactionComplete }) => {
  const { messages, addMessage, clearMessages } = useMessages();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const agentRef = useRef(null);

  // Mesajlar değiştiğinde scroll'u en sona kaydır
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (signer && accountAddress) {
      agentRef.current = new TransactionAgent(signer, accountAddress);
    }
  }, [signer, accountAddress]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Kullanıcı mesajını ekle
    addMessage({
      role: "user",
      content: input,
    });
    setInput("");
    setIsLoading(true);

    try {
      if (!agentRef.current) {
        throw new Error("Cüzdan bağlantısı gerekli");
      }
      // Agent'a mesajı gönder ve yanıtı al
      const response = await agentRef.current.processMessage(input);

      // Yanıt mesajını ekle
      addMessage({
        role: "assistant",
        content: response,
      });

      // İşlem başarılıysa callback'i çağır
      if (response.includes("✅")) {
        onTransactionComplete?.();
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Bir hata oluştu";
      addMessage({
        role: "assistant",
        content: `❌ ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mesajları zaman damgasına göre sırala
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Transaction Assistant</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearMessages}>
          <Text style={styles.clearButtonText}>Sohbeti Temizle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
      >
        {sortedMessages.map((message) => {
          const decodedContent = decodeMessage(encodeMessage(message.content));
          const isUser = message.role === "user";
          return (
            <View
              key={message.timestamp}
              style={[
                styles.messageRow,
                isUser ? styles.userRow : styles.assistantRow,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                <Text style={styles.messageText}>{decodedContent}</Text>
              </View>
            </View>
          );
        })}
        {isLoading && (
          <View style={[styles.messageRow, styles.assistantRow]}>
            <View style={[styles.messageBubble, styles.assistantMessage]}>
              <ActivityIndicator color="#ccc" />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="İşlem yapmak için mesaj yazın... (örn: veli'ye 1 eth gönder)"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937", // gray-800
    borderColor: "#374151", // gray-700
    borderWidth: 1,
    borderRadius: 10,
    margin: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    borderBottomColor: "#374151",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#F3F4F6", // gray-100
    fontSize: 18,
    fontWeight: "500",
  },
  clearButton: {
    backgroundColor: "#4B5563", // gray-700
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#D1D5DB", // gray-300
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  messageRow: {
    marginBottom: 10,
    flexDirection: "row",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "70%",
    borderRadius: 10,
    padding: 10,
  },
  userMessage: {
    backgroundColor: "#2563EB", // blue-600
  },
  assistantMessage: {
    backgroundColor: "#374151", // gray-700
  },
  messageText: {
    color: "#F3F4F6", // gray-100
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    borderTopColor: "#374151",
    borderTopWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#374151",
    color: "#F3F4F6",
    borderColor: "#4B5563",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#F3F4F6",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ChatComponent;
