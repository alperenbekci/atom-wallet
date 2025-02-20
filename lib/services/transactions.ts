import { ethers } from "ethers";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

const ALCHEMY_URL = "";

// Hex değeri BigNumber'a çeviren yardımcı fonksiyon
const hexToBigNumber = (hexValue: string): ethers.BigNumber => {
  try {
    return ethers.BigNumber.from(hexValue);
  } catch {
    return ethers.BigNumber.from(0);
  }
};

// Değeri formatlayan yardımcı fonksiyon
const formatValue = (transfer: any): string => {
  try {
    // Debug için transfer verisini logla
    console.log("Transfer data:", {
      raw: transfer,
      value: transfer.value,
      rawValue: transfer.rawContract?.value,
      asset: transfer.asset,
      category: transfer.category,
      decimals: transfer.decimals,
    });

    // Eğer değer yoksa 0 döndür
    if (!transfer.value && !transfer.rawContract?.value) return "0";

    // ETH transferleri için
    if (transfer.category === "external" || transfer.asset === "ETH") {
      // Önce raw değeri BigNumber'a çevir
      const rawValue = transfer.rawContract?.value || transfer.value;
      const bigNumberValue = hexToBigNumber(rawValue);
      return ethers.utils.formatEther(bigNumberValue);
    }

    // Token transferleri için
    if (transfer.rawContract?.value) {
      const decimals = transfer.decimals || 18;
      const bigNumberValue = hexToBigNumber(transfer.rawContract.value);
      return ethers.utils.formatUnits(bigNumberValue, decimals);
    }

    // Eğer value direkt olarak verilmişse
    if (typeof transfer.value === "string" && transfer.value.includes(".")) {
      return transfer.value;
    }

    return ethers.utils.formatUnits(
      transfer.value || "0",
      transfer.decimals || 18
    );
  } catch (err) {
    console.warn("Error formatting value:", transfer, err);
    return "0";
  }
};

export const getTransactionHistory = async (
  address: string,
  provider: ethers.providers.Provider
): Promise<Transaction[]> => {
  try {
    if (!address) return [];

    // Giden işlemleri çek
    const sentResponse = await fetch(ALCHEMY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            category: ["external", "erc20", "erc721", "erc1155"],
            withMetadata: true,
            excludeZeroValue: false,
            maxCount: "0x3e8", // 1000 işlem
            fromAddress: address,
          },
        ],
      }),
    });

    // Gelen işlemleri çek
    const receivedResponse = await fetch(ALCHEMY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 2,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            category: ["external", "erc20", "erc721", "erc1155"],
            withMetadata: true,
            excludeZeroValue: false,
            maxCount: "0x3e8", // 1000 işlem
            toAddress: address,
          },
        ],
      }),
    });

    const [sentData, receivedData] = await Promise.all([
      sentResponse.json(),
      receivedResponse.json(),
    ]);

    if (sentData.error) {
      console.error("Alchemy API error (sent):", sentData.error);
      throw new Error(sentData.error.message);
    }

    if (receivedData.error) {
      console.error("Alchemy API error (received):", receivedData.error);
      throw new Error(receivedData.error.message);
    }

    // Debug için API yanıtlarını logla
    console.log("Sent transfers:", sentData.result?.transfers);
    console.log("Received transfers:", receivedData.result?.transfers);

    // Gelen ve giden transferleri birleştir
    const transfers = [
      ...(sentData.result?.transfers || []),
      ...(receivedData.result?.transfers || []),
    ];

    // İşlemleri dönüştür
    const transactions: Transaction[] = transfers.map((transfer: any) => {
      const formattedValue = formatValue(transfer);
      console.log("Formatted value for tx:", transfer.hash, formattedValue);
      return {
        hash: transfer.hash,
        from: transfer.from,
        to: transfer.to,
        value: formattedValue,
        timestamp: transfer.metadata.blockTimestamp
          ? new Date(transfer.metadata.blockTimestamp).getTime()
          : Date.now(),
      };
    });

    // Tekrarlanan işlemleri kaldır (hash'e göre)
    const uniqueTransactions = Array.from(
      new Map(transactions.map((tx) => [tx.hash, tx])).values()
    );

    // Timestamp'e göre sırala (en yeniden en eskiye)
    return uniqueTransactions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error("Error in getTransactionHistory:", err);
    throw err;
  }
};
