import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { Platform } from "react-native";

const STORAGE_KEYS = {
  TOKEN: "_sys_cache_v2",
  NONCE: "_device_fp_id",
  EXPIRY: "_session_ttl",
};


const generateNonce = async (): Promise<string> => {
  const deviceId = Device.modelId || Device.osInternalBuildId || "unknown";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${deviceId}-${timestamp}-${random}`;
};


export const getOrCreateNonce = async (): Promise<string> => {
  let nonce = await AsyncStorage.getItem(STORAGE_KEYS.NONCE);
  if (!nonce) {
    console.log(" Generating new nonce...");
    nonce = await generateNonce();
    await AsyncStorage.setItem(STORAGE_KEYS.NONCE, nonce);
    console.log(" Nonce saved:", nonce);
  } else {
    console.log(" Using existing nonce:", nonce.substring(0, 20) + "...");
  }
  return nonce;
};


export const savePublicToken = async (
  token: string,
  expiry: string,
): Promise<void> => {
  console.log(" Saving token to AsyncStorage...");
  console.log(" Token length:", token?.length);
  console.log(" Expiry:", expiry);

  await AsyncStorage.multiSet([
    [STORAGE_KEYS.TOKEN, token],
    [STORAGE_KEYS.EXPIRY, expiry],
  ]); 

  const saved = await AsyncStorage.multiGet([
    STORAGE_KEYS.TOKEN,
    STORAGE_KEYS.EXPIRY,
  ]);
  console.log(
    " Token saved successfully. Verified:",
    saved[0][1]?.length === token.length,
  );
};


export const getPublicToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
};


export const getTokenExpiry = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEYS.EXPIRY);
};


export const isTokenExpired = async (): Promise<boolean> => {
  const expiry = await getTokenExpiry();
  if (!expiry) {
    console.log(" No expiry found in storage");
    return true;
  }

  const expiryTime = new Date(expiry).getTime();
  const now = Date.now();
  const BUFFER_MS = 30 * 1000;
  const isExpired = now + BUFFER_MS >= expiryTime;

  if (isExpired) {
    console.log(" Token expired at:", new Date(expiry).toISOString());
    console.log(" Current time:", new Date(now).toISOString());
    console.log(
      " Time until expiry (seconds):",
      Math.floor((expiryTime - now) / 1000),
    );
  } else {
    console.log(
      " Token valid for:",
      Math.floor((expiryTime - now) / 1000),
      "seconds",
    );
  }

  return isExpired;
};


export const clearPublicToken = async (): Promise<void> => {
  await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.EXPIRY]);
};
