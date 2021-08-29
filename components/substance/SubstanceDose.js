import React from 'react'
import { Caption, Title, useTheme } from 'react-native-paper'
import { styles } from './common'
import Table from './Table'


export default function SubstanceDose({substance}) {
  const theme = useTheme()

  if (!substance.formatted_dose && !substance.dose_note) {
    return null
  }

  let tables = []
  if (substance.formatted_dose) {
    for (const roa in substance.formatted_dose) {
      tables.push(
        <Table key={roa} title={roa} data={substance.formatted_dose[roa]}/>
      )
    }
  }

  return <>
    <Title style={styles.header}>Dose</Title>

    {substance.dose_note && 
      <Caption style={{marginBottom: 16, color: theme.colors.error}}>{substance.dose_note.trim()}</Caption>
    }

    {tables}
  </>
}


