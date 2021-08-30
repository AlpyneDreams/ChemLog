import React from 'react'
import { View } from 'react-native'
import { Button, Title, useTheme, Chip } from 'react-native-paper'
import EffectChip from '../effects/EffectChip'
import ShowMoreList from '../ShowMoreList'
import { styles } from './common'

export default function SubstanceEffects({ substance }) {

  if (!substance.pweffects)
    return null

  let effects = Object.keys(substance.pweffects)

  return <>
    <Title style={styles.header}>Effects</Title>
    <ShowMoreList style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {effects.map(name =>
        <EffectChip name={name} key={name} />
      )}
    </ShowMoreList>
  </>
}
