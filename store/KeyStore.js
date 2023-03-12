import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import bcrypt from '../util/bcrypt'
import { getRandomBytes } from 'expo-crypto'

bcrypt.setRandomFallback(getRandomBytes)

const secureStoreOptions = {
  requireAuthentication: true,
  keychainService: 'chemlog'
}

export default class KeyStore {

  static secureStoreAvailable = null
  static secureStorePromise = SecureStore.isAvailableAsync()
    .then(available => {
      this.secureStoreAvailable = available

      if (available) {
        this.setupKeys()
      }
    })

  static async setupKeys() {
    const key = await this.get('key')
  }
 
  static async available() {
    if (this.secureStoreAvailable === null) {
      return await this.secureStorePromise
    }
 
    return this.secureStoreAvailable
  } 

  static async setHash(key, value, saltRounds = 10) {
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(value, salt)

    return await this.set(key, hash)
  }

  static async checkHash(key, value, progressCallback = () => {}) {
    const hash = await this.get(key)
    
    if (hash === null) {
      return true
    }
    return new Promise(
      (resolve, reject) => bcrypt.compare(value, hash, (err, match) => {
        if (err)
          reject(err)
        else
          resolve(match)
      }, progressCallback)
    )
  }

  static async get(key) {
    if (await this.available()) {
      return await SecureStore.getItemAsync(key, secureStoreOptions)
    } else {
      return await AsyncStorage.getItem(key)
    } 
  }

  static async set(key, value) {
    if (await this.available()) {
      return await SecureStore.setItemAsync(key, value, secureStoreOptions)
    } else {
      return await AsyncStorage.setItem(key, value)
    }
  }

  static async delete(key) {
    if (await this.available()) {
      return await SecureStore.deleteItemAsync(key, secureStoreOptions)
    } else {
      return await AsyncStorage.removeItem(key)
    } 
  }
}