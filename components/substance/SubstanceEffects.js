import React from 'react'
import { View } from 'react-native'
import { Button, Title, useTheme, Chip } from 'react-native-paper'
import { styles } from './common'

export default function SubstanceEffects({ substance }) {

  if (!substance.pweffects)
    return null

  let effects = Object.keys(substance.pweffects)

  const theme = useTheme()
  const short = effects.length <= 8
  const [more, showMore] = React.useState(short)

  effects = more ? effects : effects.slice(0, 8)

  return <>
    <Title style={styles.header}>Effects</Title>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {effects.map(name =>
        <Chip
          key={name}
          style={styles.effect}
          mode='outlined'
        >
          {name}
        </Chip>
      )}
    </View>
    {!short ?
      <Button
        style={{ marginTop: 4 }}
        icon={more ? 'chevron-up' : 'chevron-down'}
        onPress={() => showMore(!more)}
      >
        {more ? 'Show Less' : 'Show More'}
      </Button>
    : null}
  </>
}
