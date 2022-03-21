import React, {useEffect, useState} from 'react'
import { View } from 'react-native'
import { Caption, Title, Subheading, Text, Colors, useTheme, ActivityIndicator } from 'react-native-paper'
import { styles } from './common'
import { Row } from '../Util'
import Table from './Table'
import ROA from '../../data/ROA'

const psychonautRoas = Object.fromEntries(
  ROA.roas.map(r => [r.psychonaut ?? r.name.toLowerCase(), r])
)

// TODO: Standardize dose ranges (e.g. Light, Common, Strong, Heavy, Threshold, ...)

// Colors for each dose range
const doseBarColors = [
  Colors.cyan400,   // Threshold
  Colors.green700,  // Light
  Colors.orange700, // Common
  Colors.red700     // Stron
]

// Names for each dose range
const doseRangeNames = [
  'Threshold',
  'Light',
  'Common',
  'Strong',
  'Heavy'
]

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
function DoseBars({ranges=[], unit}) {
  let min = ranges[0][0]
  let max = ranges[ranges.length-1][1]
  let range = max - min
  let bars = []
  for (let i = 0; i < ranges.length; i++) {
    let [value, next] = ranges[i]

    // Skip ranges of length zero
    if (value === next)
      continue
    
      bars.push(
      <DoseBar
        key={i}
        name={doseRangeNames[i % doseRangeNames.length]}
        color={doseBarColors[i % doseBarColors.length]}
        // Dose label
        left={`${value}\u200A${unit}`}  // U+200A HAIR SPACE
        // Last bar shows the "heavy" dose on the right
        right={i === ranges.length - 2 && `${next}\u200A${unit}`} 
        
        // Enforce a minimum size of 20% so small ranges are still visible 
        size={Math.max(0.2 * range, next - value)}
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
  const theme = useTheme()
  
  // TODO: Ensure this is being done asynchronously right

  // Placeholder for while the chart renders
  let [chart, setChart] = useState(
    <View>
      <Title style={styles.header}>Dose</Title>
      <ActivityIndicator />
    </View>
  )

  useEffect(() => {
    // HACK: In case we get unmounted.
    // Can't cancel the promise? 
    let active = true
    Render(substance, theme)
      .then(x => {active && setChart(x)})
    
    return () => {
      active = false
    }
  })

  return chart
}

/** Render the chart or table for dose */
async function Render(substance, theme) { 
  
  let tables = []
  if (substance.psychonaut) { // Psychonaut: Charts!

    for (const roa of substance.psychonaut.roas) {
      let {dose} = roa
      let ranges = [
        [dose.threshold, dose.light.min],
        [dose.light.min,  dose.light.max],
        [dose.common.min, dose.common.max],
        [dose.strong.min, dose.strong.max],
        [dose.strong.max, dose.heavy],
      ]
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
          <DoseBars ranges={ranges} unit={unit} />
        </View>
      )
    }

    tables.push(
      <Caption key='source' style={{textAlign: 'right', fontSize: 12, marginBottom: 16}}>Source: PsychonautWiki</Caption>
    )
  } else {  // TripSit: Tables

    if (!substance.formatted_dose && !substance.dose_note) {
      return null
    }

    if (substance.formatted_dose) {
      for (const roa in substance.formatted_dose) {
        tables.push(
          <Table key={roa} title={roa} data={substance.formatted_dose[roa]}/>
        )
      }
    }
    tables.push(
      <Caption key='source' style={{textAlign: 'right', fontSize: 12, marginBottom: 16}}>Source: TripSit</Caption>
    )
  }

  return <>
    <Title style={styles.header}>Dose</Title>

    {substance.dose_note && 
      <Caption style={{marginBottom: 16, color: theme.colors.error}}>{substance.dose_note.trim()}</Caption>
    }

    {tables}
  </>
}


