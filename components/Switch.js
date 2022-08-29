import React from 'react'
import { LayoutAnimation, Switch as NativeSwitch, View, StyleSheet } from 'react-native'
import { MD2Colors as Colors, TouchableRipple, useTheme } from 'react-native-paper'
import { usePrevious } from '../util/Util'

const layoutAnim = {...LayoutAnimation.Presets.easeInEaseOut, duration: 100}

/** Material 3 Style Switch */
export default function Switch({
  disabled, onChange, value, onValueChange, thumbColor, trackColor = {true: null, false: null}, ...props
}) {
  const theme = useTheme()
  const prev = usePrevious(value)
  
  if (value !== prev) {
    LayoutAnimation.configureNext(layoutAnim)
  }

  const onPress = (onChange || onValueChange) ? (e) => {
    onChange && onChange(e)
    onValueChange && onValueChange(!value)
  } : null

  const hasColor = value && !disabled

  //return (<NativeSwitch {...arguments[0]} style={{backgroundColor: 'red'}} />)

  return (
    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
      <View
        style={[
          styles.track,
          disabled ? {opacity: .5} : {},
          hasColor ? {
            backgroundColor: trackColor.true ?? theme.colors.primary,
          } : {
            backgroundColor: trackColor.false ?? (theme.dark ? theme.colors.secondaryContainer : theme.colors.secondary),
          }
        ]}

        {...props}
      >
        <TouchableRipple
          style={value ? {alignItems: 'flex-end'} : {alignItems: 'flex-start'}}
          disabled={disabled}
          onPress={onPress}
        >
          <View
            style={[
              styles.thumb,
              hasColor ? {
                backgroundColor: thumbColor ?? (theme.dark ? theme.colors.onPrimaryContainer : theme.colors.primaryContainer),
              } : {
                backgroundColor: theme.dark ? theme.colors.secondary : theme.colors.secondaryContainer
              }
            ]}
          />
        </TouchableRipple>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    width: 58, height: 28,
    margin: 12,
    borderRadius: 100,
    overflow: 'hidden'
  },
  thumb: {
    margin: 4, height: 20, width: 20,
    borderRadius: 100
  },
})