import { Storage } from './Storage'

// Base class for doses (including notes) and stashes
export class BaseItem {

  // Subclass of DataStore used to save/load
  static store

  id
  name
  type

  substance
  substanceName
  amount
  unit
  notes
  date

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

  static create(data) {

    let dose = Object.assign(new this(), data)

    dose = this.configure(dose)

    this.store.items.push(dose)
    this.store.save()
    return dose
  }

  static edit(id, data) {
    let idx = this.store.items.findIndex(d => d.id === id)
    if (idx >= 0) {
      let dose = Object.assign(new this(), data, {id})
      dose = this.configure(dose)
      this.store.items[idx] = dose
      this.store.save()
      return dose
    }
  }

  delete() {
    let index = this.constructor.store.items.findIndex(d => d === this)
    if (index >= 0) {
      this.constructor.store.items.splice(index, 1)
      this.constructor.store.save()
    }
  }
}
