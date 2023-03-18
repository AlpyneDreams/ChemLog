import React from 'react'
import { View } from 'react-native'
import { TouchableRipple, Text, useTheme } from 'react-native-paper'
import { TextInput } from './TextInput'

/**
 * Button that looks like a TextInput (for opening modals, etc.)
 */
export default function GenericInput({
  focused = false,
  label,
  value,
  onPress,
  style,
  inputStyle,
  dimText,
  ...props
}) {
  const theme = useTheme()
  const {colors} = theme

  return (
    <View style={style}>
      <View 
        pointerEvents='none'
        style={{position: 'absolute', width: '100%'}}
      >
        <TextInput
          label={label}
          value={value}
          {...props}
          outlineColor={focused ? colors.primary : null}
          underlineColor={focused ? colors.primary : colors.outline}
          textColor={dimText ? colors.onSurfaceDisabled : null}
          style={props?.mode === 'flat' ? {backgroundColor: colors.background, ...inputStyle} : inputStyle}
        />
      </View>
      <TouchableRipple 
        icon='chevron-down' mode='outlined' uppercase={false}
        onPress={onPress}
        style={{borderRadius: theme.roundness}}
      >
        <View style={{height: 56}} />
      </TouchableRipple>
    </View>
  )

}