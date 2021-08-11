import React from 'react'
import { View } from 'react-native'
import { TouchableRipple, Text, useTheme } from 'react-native-paper'

/**
 * Button that looks like a TextInput (for opening modals, etc.)
 */
export default function GenericInput({
  focused = false,
  label,
  value,
  onPress,
  style,
  textStyle,
  ...props
}) {
  const {colors} = useTheme()

  let mainColor = focused ? colors.primary : colors.placeholder

  return (
    <TouchableRipple 
      icon='chevron-down' mode='outlined' uppercase={false}
      onPress={onPress}
      {...props}
      style={{
        height: 64, paddingStart: 12, paddingTop: 8,
        borderBottomWidth: focused ? 2 : 1,
        borderBottomColor: focused ? colors.primary : colors.disabled,
        ...style
      }}
    >
      <View>
        <Text style={{
          fontSize: 12,
          color: mainColor
        }}>{label}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6}}>
          <Text style={{fontSize: 16, ...textStyle}}>{value}</Text>
          {/*<IconButton icon='chevron-down' style={{marginTop: -8}} color={mainColor}/>*/}
        </View>
      </View>
    </TouchableRipple>
  )

}