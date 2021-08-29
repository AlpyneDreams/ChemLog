import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Chip, ThemeProvider, useTheme } from 'react-native-paper'
import Substances from '../data/tripsit.drugs.json'
import { getMainCategory } from '../data/Categories'

export default function SubstanceChip({substance: id}) {

  const theme = useTheme()
  const navigation = useNavigation()
  
  const substance = Substances[id]
  const category = getMainCategory(substance) ?? {}
  const color = category.color

  return (
    <Chip
      mode='outlined'
      icon='pill'
      onPress={() => navigation.navigate('Substance', {substance: id})}
      style={color ? {
        backgroundColor: color.slice(0, 7) + '40',
        borderColor: color,
        borderWidth: 1
      } : {borderWidth: 1}}
      theme={color ? {colors: {text: color}} : null}
      textStyle={{color: theme.colors.text}}
    >
      {substance?.pretty_name ?? id}
    </Chip>
  )
}