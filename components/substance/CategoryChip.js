import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Chip, useTheme } from 'react-native-paper'
import { categories as CATEGORIES } from '../../data/Categories'
import { Row } from '../Util'

export default function CategoryChip({category, selectable = false, onChange = (() => {})}) {
  const theme = useTheme()
  const [active, setActive] = React.useState(!selectable)
  const c = category in CATEGORIES ? CATEGORIES[category] : {}
  
  const style = active && c.color ? {backgroundColor: c.color} : {}
  // Outlined: {borderColor: c.color, color: c.color, borderWidth: 1.5}

  return (
    <Chip
      mode={active ? 'flat' : 'outlined'}
      style={[styles.category, style]}
      textStyle={[styles.categoryText, active && c.color ? {color: 'white'} : null]}
      onPress={selectable ? () => {
        setActive(!active)
        onChange(category, !active)
      } : null}
    >
      {c.pretty_name || category}
    </Chip>
  )
}

const styles = StyleSheet.create({
  category: {
    marginEnd: 4,
    marginTop: 4
  },
  categoryText: {
    textTransform: 'capitalize'
  }
})