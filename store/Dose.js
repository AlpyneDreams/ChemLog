
export default class Dose {

  static doses = []
  static #nextDoseId = 0

  id = Dose.#nextDoseId++
  name

  substance
  amount
  unit
  notes
  date

  static create(data) {
    /*if (!!data.id) {
      console.warn('Dose ' + data.id + ' already has an ID, yet addDose was called.')
      if (data.id < Dose.#nextDoseId) {
        console.warn('nextDoseId: ' + Dose.#nextDoseId)
        return
      }
    }*/
    let dose = /* data .id = */ new Dose()

    dose = Object.assign(dose, data)

    dose.name = dose.substance
    if (dose.amount) {
      dose.name += ` ${dose.amount}`
      if (dose.unit) {
        dose.name += ` ${dose.unit}`
      }
    }

    Dose.doses.push(dose)
    return dose
  }

  delete() {
    let index = Dose.doses.findIndex(d => d === this)
    if (index >= 0)
      Dose.doses.splice(index, 1)
  }
}

console.log('Initialized Dose storage')
Dose.create({ substance: 'Phenibut' })

