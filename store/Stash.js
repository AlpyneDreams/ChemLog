
import { BaseItem } from './BaseItem'
import Storage, { DataStore } from './Storage'

export class Stash extends BaseItem {

  static store // = StashStorage

  id = StashStorage.nextId++
}

export class StashStorage extends DataStore {
  static key = 'stashes'
  static type = Stash

  static async load() {
    super.load()
    
    // Development build test doses
    if (this.items.length === 0) {
      Stash.create({
        substance: 'phenibut',
        substanceName: 'Phenibut',
        amount: '300',
        unit: 'mg',
        date: Date.now()
      })
    }
  }
}

Stash.store = StashStorage
