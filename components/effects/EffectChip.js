import React from 'react'
import { Linking, StyleSheet } from 'react-native'
import { Chip } from 'react-native-paper'

export default function EffectChip({name, url}) {
  return (
    <Chip
      key={name}
      style={styles.effect}
      mode='outlined'
      onPress={url ? () => {Linking.openURL(url)} : null}
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
