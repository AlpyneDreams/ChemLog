import React from 'react'
import { View } from 'react-native'
import { Row, Bold } from '../Util'
import { Caption, DataTable, Title, Card, Text, useTheme } from 'react-native-paper'
import { styles } from './common'
import Table from './Table'
import SubstanceProperties from '../../data/SubstanceProperties'
import _ from 'lodash'

function MultilineRow({children}) {
  return (
    <DataTable.Row>
      <View style={{marginBottom: 8}}>
        {children}
      </View>
    </DataTable.Row>

  )
}

export default function SubstanceMisc({substance, details}) {
  const theme = useTheme()

  const properties = Object.assign({}, substance?.properties ?? {})

  if (properties['test-kits'])
    properties['test-kits'] = properties['test-kits'].replace(/\s*\|\s*/g, '\n')


  let rows = details ? SubstanceProperties.details : SubstanceProperties.notes

  rows = _.toPairs(rows).map(([key, name]) => [name, key, properties[key]]).filter(r => !!r[2])

  if (rows.length === 0) return null

  if (details) {
    return (<>
      <Title style={styles.header}>Details</Title>
      <DataTable>

        {rows.map(([name, key, value]) => (name !== null && value) &&
          <MultilineRow>
            <Caption style={{flex: 2}}>{name}</Caption>
            <Text>{value ?? ''}</Text>
          </MultilineRow>
        )}
      </DataTable>
    </>)
  } else {

    return (<>
      {rows.map(([name, key, value]) => {
        if (!value) return null

        const color = SubstanceProperties.noteColors[key] ?? SubstanceProperties.noteColors._default
        
        return (
          <Card key={key} mode='outlined' style={{marginBottom: 12, borderColor: color, backgroundColor: color + '11'}}>
            <Card.Content>
              <Text>{name && <Bold style={{color: color}}>{name} </Bold>}{value}</Text>
            </Card.Content>
          </Card>
        )
      })}
    </>)
  }
        
}


