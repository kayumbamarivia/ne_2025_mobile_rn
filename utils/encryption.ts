import * as Crypto from 'expo-crypto';

const SALT = 'fintrack_salt_2025'; // Constant salt for the application

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + SALT,
    { encoding: Crypto.CryptoEncoding.HEX }
  );

  return hashedPassword;
}; 