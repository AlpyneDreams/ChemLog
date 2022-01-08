import React from 'react'
import { Image, StyleProp, ViewStyle } from 'react-native'
import { useTheme } from '@react-navigation/native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

/**
 * 
 * @param {StyleProp<ViewStyle>} style
 * @returns 
 */
export function Icon({icon, size=16, color, style, ...props}) {
  const theme = useTheme()

  if (typeof icon === 'string') {
    return (
      <MaterialIcon
        name={icon}
        size={size}
        color={color ?? theme.colors.text}
        style={style}
        {...props}
      />
    )
  } else if (typeof icon === 'number') {
    return (
      <Image
        source={icon}
        style={[
          {width: size, height: size, tintColor: color ?? theme.colors.text},
          style
        ]}
        {...props}
      />
    )
  } else {
    return null
  }
}
