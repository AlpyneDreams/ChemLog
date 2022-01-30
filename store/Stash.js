
import { BaseItem } from './BaseItem'
import Storage, { DataStore } from './Storage'

export class Stash extends BaseItem {

  static store // = StashStorage

  id = StashStorage.nextId++

  amountUsed = 0
  amountLeft
  totalDoses = 0
  averageDose = 0
}

export class StashStorage extends DataStore {
  static key = 'stashes'
  static type = Stash
}

Stash.store = StashStorage
