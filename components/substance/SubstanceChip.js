import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Chip, ThemeProvider, useTheme } from 'react-native-paper'
import Substances from '../../store/Substances'
import { Icon } from '../Icon'
import Haptics from '../../util/Haptics'

export default function SubstanceChip({substance: id, style, onPress, colorful=true, ...props}) {

  const theme = useTheme()
  const navigation = useNavigation()
  
  const substance = Substances[id]
  const color = colorful ? substance?.color : null
  const icon = substance?.icon

  const chipStyle = color ? {
    backgroundColor: color.slice(0, 7) + '40',
    borderColor: color,
    borderWidth: 1, ...style
  } : {borderWidth: 1, ...style}

  return (
    <Chip
      mode='flat'
      icon={icon ? ({size, color: iconColor}) => <Icon icon={icon} color={colorful ? color ?? iconColor : theme.colors.onSurfaceVariant} size={size} /> : null}
      onPress={onPress ?? (() => navigation.navigate('Substance', {substance: id}))}
      onLongPress={onPress ? () => {
        Haptics.longPress()
        navigation.navigate('Substance', {substance: id})
      } : null}
      style={chipStyle}
      theme={color ? {colors: {text: color}} : null}
      textStyle={{color: theme.colors.text}}
      {...props}
    >
      {substance?.pretty_name ?? id}
    </Chip>
  )
}