import React from 'react'
import { Card, DataTable, Caption, Title, Text, useTheme } from 'react-native-paper'
import { styles } from './common'
import Table from './Table'

function addDurationStage(roas, name, obj) {
  if (!obj) return
  
  const unit = obj._unit ?? ''

  // Add this row to the table of each ROA
  for (const [roa, duration] of Object.entries(obj)) {
    if (roa === '_unit') continue
    if (roa === 'value') continue

    roas[roa] = roas[roa] ?? {}  // create ROA table if it doesn't exist
    roas[roa][name] = `${duration} ${unit}`
  }

  // Generic value for all ROAs
  if ('value' in obj) {

    // If there's no other ROAs, add an 'All ROAs' table
    if (Object.keys(roas).length === 0) {
      roas['All ROAs'] = roas['All ROAs'] ?? {}
    }

    // Add this row to all ROA tables that don't already have it
    for (let roa in roas) {
      roas[roa][name] = roas[roa][name] ?? `${obj.value} ${unit}`
    }
  }

}

export default function SubstanceDuration({substance}) {
  const theme = useTheme()

  let roas = {}
  addDurationStage(roas, 'Onset', substance.formatted_onset)
  addDurationStage(roas, 'Duration', substance.formatted_duration)
  addDurationStage(roas, 'After-effects', substance.formatted_aftereffects)

  let tables = []
  for (const roa in roas) {
    let title = roa.replace(/_/g, ' ')

    tables.push(
      <Table key={roa} title={title} data={roas[roa]} />
    )
  }

  return (<>
    <Title style={styles.header}>Duration</Title>

    {tables}
  </>)
}