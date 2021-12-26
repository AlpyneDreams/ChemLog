import AsyncStorage from '@react-native-async-storage/async-storage'

export const STORAGE_PREFIX = '' // 'prod-', 'debug-', etc.

async function get(key, defaultValue=null) {
  let value = await AsyncStorage.getItem(STORAGE_PREFIX + key).catch(console.error)
  return JSON.parse(value) ?? defaultValue
}

async function set(key, value) {
  return await AsyncStorage.setItem(STORAGE_PREFIX+key, JSON.stringify(value)).catch(console.error)
}

const Storage = {get, set}
export default Storage

export class DataStore {
  static loaded = false
  static key = null
  static type = null
  static items = []
  static nextId = 0

  static async save() {
    let data = {
      items: this.items, nextId: this.nextId
    }

    await Storage.set(this.key, data)
  }

  static async load() {
    if (this.loaded)
      return

    // Load data
    let data = await Storage.get(this.key, this)
    this.items = data.items.map(d => Object.assign(new this.type(), d))
    this.nextId = data.nextId
    this.loaded = true
  }
}
