import { AES, enc } from 'crypto-js';

export const encrypt = async (data: string, key: string): Promise<string> => {
    return AES.encrypt(data, key).toString();
};

export const decrypt = async (encryptedData: string, key: string): Promise<string> => {
    const decrypted = AES.decrypt(encryptedData, key);
    return decrypted.toString(enc.Utf8);
}; 