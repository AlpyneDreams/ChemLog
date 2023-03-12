import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Chip, ThemeProvider, useTheme } from 'react-native-paper'
import Substances from '../../store/Substances'
import { Icon } from '../Icon'

export default function SubstanceChip({substance: id, style}) {

  const theme = useTheme()
  const navigation = useNavigation()
  
  const substance = Substances[id]
  const color = substance?.color
  const icon = substance?.icon

  return (
    <Chip
      mode='outlined'
      icon={icon ? ({size, color: iconColor}) => <Icon icon={icon} color={color ?? iconColor} size={size} /> : null}
      onPress={() => navigation.navigate('Substance', {substance: id})}
      style={color ? {
        backgroundColor: color.slice(0, 7) + '40',
        borderColor: color,
        borderWidth: 1, ...style
      } : {borderWidth: 1, ...style}}
      theme={color ? {colors: {text: color}} : null}
      textStyle={{color: theme.colors.text}}
    >
      {substance?.pretty_name ?? id}
    </Chip>
  )
}