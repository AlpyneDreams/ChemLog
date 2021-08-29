import React from 'react'
import { Card, DataTable, Text, useTheme } from 'react-native-paper'

export default function Table({title, data}) {
  const theme = useTheme()

  return (
    <Card style={{ marginBottom: 12 }} mode='elevated' key={title}>
      <DataTable>
        {title &&
          <DataTable.Header>
            <DataTable.Title>
              <Text style={{ fontSize: 15, color: theme.colors.placeholder }}>{title}</Text>
            </DataTable.Title>
          </DataTable.Header>
        }
        {Object.entries(data).map(
          ([key, value]) =>
          <DataTable.Row key={key}>
            <DataTable.Title>{key}</DataTable.Title>
            <DataTable.Cell>{value}</DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable>
    </Card>
  )
}
