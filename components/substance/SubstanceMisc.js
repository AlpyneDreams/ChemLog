import React from 'react'
import { View } from 'react-native'
import { Row, Bold } from '../Util'
import { Caption, DataTable, Title, Card, Text, useTheme, Paragraph } from 'react-native-paper'
import { styles } from './common'
import Table from './Table'
import SubstanceProperties from '../../data/SubstanceProperties'
import _ from 'lodash'
import { Source } from './Source'
import { SubstanceDivider } from './SubstanceDivider'

function MultilineRow({children, last}) {
  return !last ? (
    <DataTable.Row>
      <View style={{marginBottom: 8}}>
        {children}
      </View>
    </DataTable.Row>
  ) : (
    <View style={{minHeight: 48, paddingHorizontal: 16}}>
      <View style={{marginBottom: 8}}>
        {children}
      </View>
    </View>
  )
}

function DataRow({name, children, last=false}) {
  return (
    <MultilineRow last={last}>
      <Caption style={{flex: 2}}>{name}</Caption>
      <Text>{children ?? ''}</Text>
    </MultilineRow>
  )
}

export default function SubstanceMisc({substance, details}) {
  const theme = useTheme()

  const properties = Object.assign({}, substance?.properties ?? {})

  if (properties['test-kits'])
    properties['test-kits'] = properties['test-kits'].replace(/\s*\|\s*/g, '\n')


  let rows = details ? SubstanceProperties.details : SubstanceProperties.notes

  rows = _.toPairs(rows).map(([key, name]) => [name, key, properties[key]]).filter(r => !!r[2])

  if (details && substance.psychonaut) {
    let psy = substance.psychonaut
    if (psy.toxicity) {
      rows.unshift(['Toxicity', 'psy.toxicity', psy.toxicity])
    }
    if (psy.addictionPotential) {
      rows.unshift(['Addiction Potential', 'psy.addictionPotential', psy.addictionPotential])
    }
    if (psy.class != null) {
      if (psy.class.chemical) {
        rows.unshift(['Chemical Class', 'psy.class.chemical', psy.class.chemical])
      }
      if (psy.class.psychoactive) {
        rows.unshift(['Psychoactive Class', 'psy.class.psychoactive', psy.class.psychoactive])
      }
    }
  }

  let numRows = rows.length
  if (numRows === 0) return null

  if (details) {
    let tolerance = null
    if (substance.psychonaut) {
      let psy = substance.psychonaut
      if (psy.tolerance) {
        let {full, half, zero} = psy.tolerance
        tolerance = (<>
          <Title style={styles.header}>Tolerance</Title>
          <DataTable>

            {full && <DataRow name="Full tolerance" last={!half && !zero}>{full}</DataRow>}
            {half && <DataRow name="Decreases to half after" last={!zero}>{half}</DataRow>}
            {zero && <DataRow name="Returns to baseline after" last={true}>{zero}</DataRow>}
          </DataTable>
          <Source style={{marginVertical: 16}}>PsychonautWiki</Source>
          <SubstanceDivider/>
        </>)
      }
    }
    return (<>
      {tolerance}
      <Title style={styles.header}>Details</Title>
      <DataTable style={{marginBottom: 20}}>

        {rows.map(([name, key, value], index) => (name !== null && value) &&
          <DataRow key={key} name={name} last={index == numRows-1}>{value}</DataRow>
        )}
      </DataTable>
      <SubstanceDivider/>
    </>)
  } else {

    return (<>
      {rows.map(([name, key, value]) => {
        if (!value) return null

        const color = SubstanceProperties.noteColors[key] ?? SubstanceProperties.noteColors._default
        
        return (
          <Card key={key} mode='contained' style={{marginBottom: 12, borderColor: color, borderWidth: 1, backgroundColor: color + '11'}}>
            <Card.Content>
              <Text>{name && <Bold style={{color: color}}>{name} </Bold>}{value}</Text>
            </Card.Content>
          </Card>
        )
      })}
    </>)
  }
        
}
