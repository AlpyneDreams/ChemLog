import React from 'react'
import { StyleSheet } from 'react-native'
import { Chip } from 'react-native-paper'

export default function EffectChip({name}) {
  return (
    <Chip
      key={name}
      style={styles.effect}
      mode='outlined'
    >
      {name}
    </Chip>
  )
}


const styles = StyleSheet.create({
  effect: {
    marginEnd: 4,
    marginTop: 4,
    maxWidth: 200
  }
})
