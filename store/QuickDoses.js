import ROA from '../data/ROA'

const roas = {}
for (const roa of ROA.roas) {
  roas[roa.name] = roa
}

const fallback = ROA.roas.slice(0, 4).map(x => ({...x, displayName: x.displayName ?? x.name}))

export function getROAs(substance) {
  // TODO: Object
  let roaList = []
  if (substance?.quickDoses) {
    for (const roa in substance.quickDoses) {
      roaList.push({...roas[roa], displayName: roa})
    }
  }
  if (substance?.formatted_dose) {
    for (const roa in substance.formatted_dose) {
      roaList = roaList.filter(x => x.name !== roa)
      roaList.push({...roas[roa], displayName: roa})
    }
  }
  if (substance?.roaAliases) {
    for (const name in substance.roaAliases) {
      roaList = roaList.filter(x => x.name !== name)
      roaList.push({...roas[name], displayName: substance.roaAliases[name]})
    }
  }
  if (roaList.length == 0)
    return fallback
  return roaList
}

const QuickDoses = {getROAs}
export default QuickDoses