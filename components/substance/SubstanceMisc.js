import React from 'react'
import { Row, Bold } from '../Util'
import { Caption, DataTable, Title, Card, Text, useTheme } from 'react-native-paper'
import { styles } from './common'
import Table from './Table'
import SubstanceProperties from '../../data/SubstanceProperties'
import _ from 'lodash'


export default function SubstanceMisc({substance, details}) {
  const theme = useTheme()

  const properties = substance?.properties ?? {}
  let rows = details ? SubstanceProperties.details : SubstanceProperties.notes

  rows = _.toPairs(rows).map(([key, name]) => [name, key, properties[key]]).filter(r => !!r[2])

  if (rows.length === 0) return null

  if (details) {
    return (<>
      <Title style={styles.header}>Details</Title>
      <DataTable>
        {rows.map(([name, key, value]) => value &&
          <DataTable.Row key={key}>
            <DataTable.Title style={{flex: 2}}>{name}</DataTable.Title>
            <Row style={{flex: 3, alignItems: 'center'}}>
              <Text style={{textAlignVertical: 'center'}}>{value ?? ''}</Text>
            </Row>
          </DataTable.Row>
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


