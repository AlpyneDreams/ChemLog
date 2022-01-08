import React from 'react'
import { View } from 'react-native'
import { Button, Title, useTheme, Chip, Caption } from 'react-native-paper'
import EffectChip from '../effects/EffectChip'
import ShowMoreList from '../ShowMoreList'
import { styles } from './common'

export default function SubstanceEffects({ substance }) {

  if (!substance.pweffects)
    return null

  let effects = Object.entries(substance.pweffects)

  return <>
    <Title style={styles.header}>Effects</Title>
    <Caption style={{marginBottom: 12, marginTop: -8}}>Tap to view on PsychonautWiki</Caption>
    <ShowMoreList style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {effects.map(([name, url]) =>
        <EffectChip name={name} url={url} key={name} />
      )}
    </ShowMoreList>
  </>
}
