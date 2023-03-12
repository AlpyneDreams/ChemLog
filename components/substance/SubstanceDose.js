import React, {useEffect, useState} from 'react'
import { View, StyleSheet } from 'react-native'
import { Caption, ToggleButton, Title, Subheading, Text, MD2Colors as Colors, useTheme, ActivityIndicator, ProgressBar, overlay, RadioButton } from 'react-native-paper'
import { styles } from './common'
import { Row } from '../Util'
import Table from './Table'
import ROA from '../../data/ROA'
import { TabBar, TabButton } from '../Tabs'
import { Source } from './Source'
import UserData from '../../store/UserData'

export const psychonautRoas = Object.fromEntries(
  ROA.roas.map(r => [r.psychonaut ?? r.name.toLowerCase(), r])
)

// TODO: Standardize dose ranges (e.g. Light, Common, Strong, Heavy, Threshold, ...)

const DOSE_RANGES = {
  Threshold: {name: 'Threshold', color: Colors.cyan400},
  Light:     {name: 'Light', color: Colors.green700},
  Common:    {name: 'Common', color: Colors.orange700},
  Strong:    {name: 'Strong', color: Colors.red700},
  Heavy:     {name: 'Heavy'}
}

/** One range on the number line of possible doses.
 *  Bar + bottom label + left label [+ right label] */
function DoseBar({size=1, name='', color, left='', right=''}) {
  return (
    <View style={{flex: size}}>
      <Row style={{justifyContent: 'space-between'}}>
        {/* Left label */}
        <Caption style={{marginLeft: -16, fontSize: 12}}>{left}</Caption>
        {/* Right label */}
        {right && <Caption style={{marginRight: -16, fontSize: 12}}>{right}</Caption>}
      </Row>
      <View>
        {/* Bar */}
        <View style={{backgroundColor: color, width: '100%', height: 8}}/>
        {/* Bottom caption */}
        <Caption style={{textAlign: 'center', fontSize: 10}}>{name}</Caption>
      </View>
    </View>
  )
}

/** Number line showing different ranges of doses  */
function DoseBars({ranges=[], unit, min, max}) {
  let range = max - min
  let bars = []

  // Skip ranges of length zero
  ranges = ranges.filter(r => (r.min !== r.max) && (r.min != null && r.max != null))

  for (let i = 0; i < ranges.length; i++) {
    let {type, min: left, max: right} = ranges[i]

    bars.push(
      <DoseBar
        key={i} name={type.name} color={type.color}
        // Dose label
        left={`${left}\u200A${unit}`}  // U+200A HAIR SPACE
        // Last bar shows the "heavy" dose on the right
        right={i === ranges.length - 1 && `${right}\u200A${unit}`} 
        
        // Enforce a minimum size of 20% so small ranges are still visible 
        size={Math.max(0.2 * range, right - left)}
      />
    )
  }

  return (
    <Row style={{marginBottom: 8, marginHorizontal: 16, justifyContent: 'space-evenly'}}>
      {bars}
    </Row>
  )
}

export default function SubstanceDose({substance}) {
  const userData = UserData.useContext()
  const theme = useTheme()

  const hasPsychonautDose = !!substance.psychonaut
  const hasTripsitDose = !!(substance.formatted_dose || substance.dose_note)
  const hasBoth = hasPsychonautDose && hasTripsitDose

  const [tab, setTab] = useState(hasPsychonautDose && userData.prefs.dataSource == 'psychonaut' ? 1 : 0)
  const tripsit = (tab == 0)

  // TODO: Perhaps render the DoseChart asynchronously somehow?

  return <View style={{paddingHorizontal: 20}}>
    <Title style={styles.header}>Dose</Title>

    {hasBoth && (<>
      <TabBar n={2} names={['TripSit', 'Psychonaut']} tab={tab} setTab={setTab}/>
    </>)}

    <View style={{backgroundColor: hasBoth && (theme.dark ? '#00000055' : '#0000000A'), marginHorizontal: -20, paddingHorizontal: 20, paddingVertical: 16}}>

      <DoseChart substance={substance} theme={theme} tripsit={tripsit} />

      <Source>{tripsit ? 'TripSit' : 'PsychonautWiki'}</Source>
    </View>
  </View>
}

/** Render the chart or table for dose */
function DoseChart({substance, theme, tripsit}) { 

  let tables = []
  if (substance.psychonaut && !tripsit) { // Psychonaut: Charts!

    if (!substance.psychonaut.roas)
      return <></>

    for (const roa of substance.psychonaut.roas) {
      let {dose} = roa

      if (!dose)
        continue
      
      let ranges = [
        {type: DOSE_RANGES.Threshold, min: dose.threshold, max: dose.light?.min},
        {type: DOSE_RANGES.Light, min: dose.light?.min, max: dose.light?.max},
        {type: DOSE_RANGES.Common, min: dose.common?.min, max: dose.common?.max},
        {type: DOSE_RANGES.Strong, min: dose.strong?.min, max: dose.strong?.max},
        {type: DOSE_RANGES.Heavy, min: dose.strong?.max, max: dose.heavy ?? dose.strong?.max},
      ]

      let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY
      for (const {min: a, max: b} of ranges) {
        for (const value of [a, b]) {
          if (value < min) min = value
          if (value > max) max = value
        }
      }

      let unit = roa.dose.units
      let name = roa.name

      // Look up pretty name for this ROA
      let roaData = psychonautRoas[name]
      if (roaData) {
        name = roaData.name
      }

      tables.push(
        <View key={roa.name} style={{marginVertical: 12}}>
          <Subheading style={{marginBottom: 0, textAlign: 'center'}}>{name}</Subheading>
          <DoseBars ranges={ranges} unit={unit} min={min} max={max} />
        </View>
      )
    }
  } else {  // TripSit: Tables

    if (!substance.formatted_dose && !substance.dose_note) {
      return null
    }

    if (substance.dose_note) {
      tables.push(
        <Caption key='dose-note' style={{marginBottom: 16, color: theme.colors.error}}>{substance.dose_note.trim()}</Caption>
      )
    }

    if (substance.formatted_dose) {
      for (const roa in substance.formatted_dose) {
        tables.push(
          <Table key={roa} title={roa} data={substance.formatted_dose[roa]}/>
        )
      }
    }
  }

  return tables
}
