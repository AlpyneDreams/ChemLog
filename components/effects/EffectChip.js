import React from 'react'
import { Linking, StyleSheet } from 'react-native'
import { Chip, useTheme } from 'react-native-paper'

export default function EffectChip({name, url}) {
  const theme = useTheme()
  return (
    <Chip
      key={name}
      compact={true}
      style={[styles.effect, {borderColor: theme.colors.surfaceVariant}]}
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
