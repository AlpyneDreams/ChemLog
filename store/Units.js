import Units from '../data/Units'

function convert(value, from, to) {
  return value * to.factor / from.factor
}

export function convertUnits(value, from, to) {
  from = Units[from], to = Units[to]

  if (from.type !== to.type) {
    console.error(`Cannot convert units from ${from.type ?? 'mass'} to ${to.type ?? 'mass'}`)
    return value
  }

  return convert(value, from.factor, to.factor)
}

// Convert to the unit with the most compact number.
// (e.g prefer 1.8 g over 1800 mg, prefer 600 mg over 0.6 g)
export function toBestUnit(amount, unit) {
  const from = Units[unit]
  const type = from.type
  const absAmount = Math.abs(amount)
  const realAmount = absAmount / from.factor

  if (type === 'volume') {
    return [amount, unit]
  }

  const ug = convert(amount, from, Units.ug)
  if (ug >= 1000000) {
    return [convert(ug, Units.ug, Units.g), 'g']
  } else if (ug >= 1000) {
    return [convert(ug, Units.ug, Units.mg), 'mg']
  } else {
    return [ug, Units.ug.symbol]
  }
}


// Returns [sum, sumUnit, avg, avgUnit]
export function sumAvgAmounts(doses = [], initialUnit = 'g') {

  let totalCounted = 0

  let [amount, unit] = doses.reduce( ([amount, unit], dose) => {

    if (!dose.unit || (!dose.amount && dose.amount !== 0)) {
      // Dose does not contribute an amount
      return [amount, unit]
    }

    let au = Units[unit],
        bu = Units[dose.unit]

    if (au.type !== bu.type) {
      // Ignore incompatible types (e.g. mass + volume)
      return [amount, unit]
    }

    totalCounted++

    let a = amount, b = Number(dose.amount)
    
    // Convert to the smaller unit to avoid precision errors
    if (au.factor == bu.factor) {
      return [a + b, au.symbol]
    } else if (au.factor > bu.factor) {
      b = convert(b, bu, au)
      return [a + b, au.symbol]
    } else {
      a = convert(a, au, bu)
      return [a + b, bu.symbol]
    }

  }, [0, initialUnit])

  let [sum, sumUnit] = toBestUnit(amount, unit)
  let [avg, avgUnit] = toBestUnit(amount / totalCounted, unit)

  if (totalCounted === 0) {
    [avg, avgUnit] = [0, initialUnit]
  }

  return [sum, sumUnit, avg, avgUnit]

}
