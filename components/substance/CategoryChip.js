import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Chip, useTheme, MD3Colors } from 'react-native-paper'
import { categories as CATEGORIES } from '../../store/Categories'
import { Icon } from '../Icon'
import { Row } from '../Util'

export default function CategoryChip({category, selectable = false, onChange = (() => {})}) {
  const theme = useTheme()
  const [active, setActive] = React.useState(!selectable)
  const c = category in CATEGORIES ? CATEGORIES[category] : {}

  const hasColor = !!(c.chipColor ?? c.color)
  const color = c.chipColor ?? c.color ?? theme.colors.secondaryContainer
  const icon = c.chipIcon ?? c.icon
  
  let style = active
    ? {backgroundColor: color}
    : {borderColor: theme.dark ? theme.colors.surfaceVariant : MD3Colors.neutral70}

  // Invisible border to keep size consistent
  if (selectable && active)
    style = {...style, borderColor: 'transparent', borderWidth: 1}

  return (
    <Chip
      mode={active ? 'flat' : 'outlined'}
      style={[styles.category, style]}
      textStyle={[styles.categoryText, active && hasColor ? {color: 'white'} : null]}
      compact={true}
      onPress={selectable ? () => {
        setActive(!active)
        onChange(category, !active)
      } : null}
      icon={icon ? ({size, color: iconColor}) => (<Icon icon={icon} color={active && hasColor ? 'white' : theme.colors.outline} size={size} />) : null}
    >
      {c.pretty_name || category}
    </Chip>
  )
}

const styles = StyleSheet.create({
  category: {
    backgroundColor: 'transparent',
    marginEnd: 6,
    marginVertical: 4
  },
  categoryText: {
    textTransform: 'capitalize'
  }
})