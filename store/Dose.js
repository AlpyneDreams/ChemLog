
import { cloneDeep } from 'lodash'
import { BaseItem } from './BaseItem'
import Storage, { DataStore } from './Storage'

export class Dose extends BaseItem {

  static store // = DoseStorage

  id = DoseStorage.nextId++
  
  roa

  createCopy(navigation) {
    const copy = cloneDeep(this)
    delete copy.id
    copy.date = null
    if (this.type === 'note')
      navigation.navigate('AddNote', {note: copy})
    else
      navigation.navigate('AddDose', {dose: copy})
  }

  static configure(dose) {
    
    if (dose.type === 'note')
      return dose

    if (!dose.substanceName)
      dose.substanceName = dose.substance

    dose.name = dose.substanceName
    if (dose.amount) {
      dose.name += ` ${dose.amount}`
      if (dose.unit) {
        dose.name += ` ${dose.unit}`
      }
    }
    return dose
  }

}

export class DoseStorage extends DataStore {

  static key = 'doses'
  static type = Dose

  static async load() {
    if (this.loaded)
      return

    // Load data. Remap legacy key names
    let data = await Storage.get(this.key, this)
    this.items = (data.items ?? data.doses).map(d => Object.assign(new this.type(), d))
    this.nextId = (data.nextId ?? data.nextDoseId)
    this.loaded = true
  }
}

Dose.store = DoseStorage
