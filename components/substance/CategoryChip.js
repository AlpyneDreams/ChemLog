import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Chip, useTheme } from 'react-native-paper'
import { categories as CATEGORIES } from '../../store/Categories'
import { Icon } from '../Icon'
import { Row } from '../Util'

export default function CategoryChip({category, selectable = false, onChange = (() => {})}) {
  const theme = useTheme()
  const [active, setActive] = React.useState(!selectable)
  const c = category in CATEGORIES ? CATEGORIES[category] : {}

  const color = c.chipColor ?? c.color
  
  const style = active && color ? {backgroundColor: color} : {}
  // Outlined: {borderColor: color, color: color, borderWidth: 1.5}

  return (
    <Chip
      mode={active ? 'flat' : 'outlined'}
      style={[styles.category, style]}
      textStyle={[styles.categoryText, active && color ? {color: theme.colors.text} : null]}
      onPress={selectable ? () => {
        setActive(!active)
        onChange(category, !active)
      } : null}
      icon={c.icon ? ({size}) => (<Icon icon={c.icon} color={theme.colors.text} size={size} />) : null}
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