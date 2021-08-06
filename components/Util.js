import React from 'react'
import { View } from "react-native";

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