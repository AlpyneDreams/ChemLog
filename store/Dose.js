
import Storage from './Storage'

export class Dose {

  id = DoseStorage.nextDoseId++
  name

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

    let dose = Object.assign(new Dose(), data)

    dose = Dose.configure(dose)

    DoseStorage.doses.push(dose)
    DoseStorage.save()
    return dose
  }

  static edit(id, data) {
    let idx = DoseStorage.doses.findIndex(d => d.id === id)
    if (idx >= 0) {
      let dose = Object.assign(new Dose(), data, {id})
      dose = Dose.configure(dose)
      DoseStorage.doses[idx] = dose
      DoseStorage.save()
      return dose
    }
  }

  delete() {
    let index = DoseStorage.doses.findIndex(d => d === this)
    if (index >= 0) {
      DoseStorage.doses.splice(index, 1)
      DoseStorage.save()
    }
  }
}


export class DoseStorage {
  static loaded = false
  static doses = []
  static nextDoseId = 0

  static async save() {
    let data = {
      doses: DoseStorage.doses, nextDoseId: DoseStorage.nextDoseId
    }
    await Storage.set('doses', data)
  }

  static async load() {
    if (DoseStorage.loaded)
      return
    
    let data = await Storage.get('doses', DoseStorage)
    DoseStorage.doses = data.doses.map(d => Object.assign(new Dose(), d))
    DoseStorage.nextDoseId = data.nextDoseId
    DoseStorage.loaded = true

    // Development build test doses
    if (DoseStorage.doses.length === 0) {
      Dose.create({ substance: 'phenibut', substanceName: 'Phenibut', amount: '300', unit: 'mg', roa: 'Oral', notes: 'First dose.', date: Date.now() })
    }

  }
}

