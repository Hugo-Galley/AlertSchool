// Stockage sécurisé cross-platform :
//  - mobile (iOS/Android) -> expo-secure-store
//  - web -> AsyncStorage (SecureStore n'existe pas sur web)
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export const storage = {
  async get(key: string): Promise<string | null> {
    return isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (isWeb) await AsyncStorage.setItem(key, value);
    else await SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (isWeb) await AsyncStorage.removeItem(key);
    else await SecureStore.deleteItemAsync(key);
  },
};
