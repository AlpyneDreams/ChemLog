import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_PREFIX = '' // 'prod-', 'debug-', etc.

async function get(key, defaultValue=null) {
  let value = await AsyncStorage.getItem(STORAGE_PREFIX + key).catch(console.error)
  return JSON.parse(value) ?? defaultValue
}

async function set(key, value) {
  return await AsyncStorage.setItem(STORAGE_PREFIX+key, JSON.stringify(value)).catch(console.error)
}

export default {get, set}