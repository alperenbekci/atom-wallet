import "react-native-get-random-values";
import { ethers } from "ethers";
import { encrypt, decrypt } from "./../utils/encryption";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Device from "expo-device";

const WALLET_STORAGE_KEY = "local_wallet_encrypted";
const DEVICE_ID_KEY = "device_id";
const PERMANENT_ID_KEY = "permanent_device_id";
const CANVAS_ID_KEY = "canvas_fingerprint";

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export class LocalWallet {
  private static instance: LocalWallet;
  private wallet: ethers.Wallet | null = null;
  private provider: ethers.providers.JsonRpcProvider | null = null;
  private initialized: boolean = false;
  private static cachedWallet: ethers.Wallet | null = null;

  private constructor() {
    this.loadWalletSync();
  }

  static getInstance(): LocalWallet {
    if (!LocalWallet.instance) {
      LocalWallet.instance = new LocalWallet();
    }
    return LocalWallet.instance;
  }

  private getCanvasFingerprint(): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Çizim yaparak benzersiz parmak izi oluştur
    canvas.width = 200;
    canvas.height = 200;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("DeviceFingerprint", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("DeviceFingerprint", 4, 17);

    return canvas.toDataURL();
  }

  private getStorageFingerprint(): string {
    try {
      const testKey = "test_storage";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return "storage_available";
    } catch {
      return "storage_unavailable";
    }
  }

  private getPermanentDeviceId(): string {
    let permanentId = localStorage.getItem(PERMANENT_ID_KEY);

    if (!permanentId) {
      // IndexedDB kullanılabilirliği
      const hasIndexedDB = !!window.indexedDB;

      // WebGL bilgileri
      const gl = document.createElement("canvas").getContext("webgl");
      const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info");
      const renderer = debugInfo
        ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : "";

      // Ekran özellikleri
      const screenData = {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation?.type,
      };

      // Tarayıcı özellikleri
      const browserData = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as NavigatorWithMemory).deviceMemory,
        maxTouchPoints: navigator.maxTouchPoints,
      };

      // Tüm verileri birleştir
      const deviceData = JSON.stringify({
        screen: screenData,
        browser: browserData,
        renderer: renderer,
        hasIndexedDB: hasIndexedDB,
        storageType: this.getStorageFingerprint(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Benzersiz ve kalıcı bir ID oluştur
      permanentId = ethers.utils.id(deviceData);
      localStorage.setItem(PERMANENT_ID_KEY, permanentId);
    }

    return permanentId;
  }

  private async getDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

      if (!deviceId) {
        // Cihaz bilgilerini topla
        const deviceInfo = {
          brand: Device.brand,
          manufacturer: Device.manufacturer,
          modelName: Device.modelName,
          osName: Device.osName,
          osVersion: Device.osVersion,
          platformApiLevel: Device.platformApiLevel,
          platform: Platform.OS,
        };

        // Benzersiz bir ID oluştur
        deviceId = ethers.utils.id(JSON.stringify(deviceInfo));
        await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
      }

      return deviceId;
    } catch (error) {
      console.error("Error getting device ID:", error);
      // Fallback olarak rastgele bir ID oluştur
      return ethers.utils.id(Date.now().toString());
    }
  }

  private generateDeterministicWallet(deviceId: string): ethers.Wallet {
    const entropy = ethers.utils.arrayify(deviceId);
    const mnemonic = ethers.utils.entropyToMnemonic(entropy);
    return ethers.Wallet.fromMnemonic(mnemonic);
  }

  private async loadWalletSync() {
    try {
      if (LocalWallet.cachedWallet) {
        this.wallet = LocalWallet.cachedWallet;
        return;
      }

      const deviceId = await this.getDeviceId();
      const encryptedWallet = await AsyncStorage.getItem(WALLET_STORAGE_KEY);

      if (!encryptedWallet) {
        this.wallet = this.generateDeterministicWallet(deviceId);
        LocalWallet.cachedWallet = this.wallet;
      }
    } catch (error) {
      console.error("Error in sync wallet loading:", error);
    }
  }

  async initialize(rpcUrl: string): Promise<void> {
    if (this.initialized && this.provider && this.wallet) {
      return;
    }

    try {
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      if (!this.wallet) {
        const deviceId = await this.getDeviceId();
        const encryptedWallet = await AsyncStorage.getItem(WALLET_STORAGE_KEY);

        if (encryptedWallet) {
          const decryptedJson = await decrypt(encryptedWallet, deviceId);
          this.wallet = await ethers.Wallet.fromEncryptedJson(
            decryptedJson,
            deviceId
          );
        } else {
          this.wallet = this.generateDeterministicWallet(deviceId);
          const encryptedJson = await this.wallet.encrypt(deviceId);
          const encrypted = await encrypt(encryptedJson, deviceId);
          await AsyncStorage.setItem(WALLET_STORAGE_KEY, encrypted);
        }
        LocalWallet.cachedWallet = this.wallet;
      }

      if (this.provider) {
        this.wallet = this.wallet.connect(this.provider);
        LocalWallet.cachedWallet = this.wallet;
      }

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing local wallet:", error);
      throw error;
    }
  }

  getAddress(): string | null {
    return this.wallet?.address || null;
  }

  getSigner(): ethers.Wallet | null {
    return this.wallet;
  }

  getProvider(): ethers.providers.Provider | null {
    return this.provider;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    return this.wallet.signMessage(message);
  }

  async signTransaction(
    transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
  ): Promise<string> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    const resolvedTx = await ethers.utils.resolveProperties(transaction);
    return this.wallet.signTransaction(resolvedTx);
  }
}
