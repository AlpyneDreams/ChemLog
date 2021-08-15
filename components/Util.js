import React from 'react'
import { View, ViewProps } from 'react-native'

/**
 * @param {ViewProps} props
 */
export function Row(props) {
  return <View
    {...props}
    style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      ...props.style
    }}
  />
}