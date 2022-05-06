import React from 'react'
import { View } from 'react-native'
import { Card, DataTable, Caption, Title, Text, useTheme } from 'react-native-paper'
import { TabBar } from '../Tabs'
import { styles } from './common'
import { Source } from './Source'
import Table from './Table'
import { psychonautRoas } from './SubstanceDose'

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

function addPsychonautDurationStage(roas, roa, name, v) {
  if (!v) return

  // Look up pretty name for this ROA
  let roaData = psychonautRoas[roa]
  if (roaData) {
    roa = roaData.name
  }

  roas[roa] = roas[roa] ?? {}
  roas[roa][name] = `${v.min}-${v.max} ${v.units}`
}

export default function SubstanceDuration({substance}) {
  const theme = useTheme()

  const hasPsychonautDose = !!(substance.psychonaut && substance.psychonaut?.roas)
  const hasTripsitDose = !!(substance.formatted_onset || substance.formatted_duration || substance.formatted_aftereffects)
  const hasBoth = hasPsychonautDose && hasTripsitDose
  const [tab, setTab] = React.useState(1)
  const tripsit = (tab === 0)

  let roas = {}
  if (tripsit) {
    addDurationStage(roas, 'Onset', substance.formatted_onset)
    addDurationStage(roas, 'Duration', substance.formatted_duration)
    addDurationStage(roas, 'After-effects', substance.formatted_aftereffects)
  } else {
    for (const {name, duration} of substance.psychonaut.roas) {
      addPsychonautDurationStage(roas, name, 'Total', duration?.total)
      addPsychonautDurationStage(roas, name, 'Duration', duration?.duration)
      addPsychonautDurationStage(roas, name, 'Onset', duration?.onset)
      addPsychonautDurationStage(roas, name, 'Come-up', duration?.comeup)
      addPsychonautDurationStage(roas, name, 'Peak', duration?.peak)
      addPsychonautDurationStage(roas, name, 'Offset', duration?.offset)
      addPsychonautDurationStage(roas, name, 'After-effects', duration?.afterglow)
    }
  }

  let tables = []
  for (const roa in roas) {
    let title = roa.replace(/_/g, ' ')

    tables.push(
      <Table key={(tripsit ? 'ts-' : 'pn-') + roa} title={title} data={roas[roa]} />
    )
  }

  if (tables.length === 0) return null

  return (<View style={{paddingBottom: 20}}>
    <Title style={styles.header}>Duration</Title>

    <TabBar names={['TripSit', 'Psychonaut']} tab={tab} setTab={setTab}/>
    <View style={{backgroundColor: hasBoth && (theme.dark ? '#00000055' : '#0000000A'), marginHorizontal: -20, paddingHorizontal: 20, paddingVertical: 16}}>
      {tables}

      <Source>{tripsit ? 'TripSit' : 'PsychonautWiki'}</Source>
    </View>

  </View>)
}