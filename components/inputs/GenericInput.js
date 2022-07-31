import React from 'react'
import { View } from 'react-native'
import { TouchableRipple, Text, TextInput, useTheme } from 'react-native-paper'

/**
 * Button that looks like a TextInput (for opening modals, etc.)
 */
export default function GenericInput({
  focused = false,
  label,
  value,
  onPress,
  style,
  dimText,
  icon,
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
          right={icon && <TextInput.Icon name={icon} />}
          spellCheck={false}
          {...props}
          outlineColor={focused ? colors.primary : null}
          underlineColor={focused ? colors.primary : null}
          theme={dimText ? {colors: {text: colors.disabled}} : null}
        />
      </View>
      <TouchableRipple 
        icon='chevron-down' mode='outlined' uppercase={false}
        onPress={onPress}
        style={{borderRadius: theme.roundness}}
      >
        <View style={{height: 64}} />
      </TouchableRipple>
    </View>
  )

}