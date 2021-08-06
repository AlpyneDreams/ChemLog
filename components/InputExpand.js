import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

export default function InputExpand(props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View style={{flexDirection: 'row', ...props.style}}>
    {!expanded
    ? <Button mode='outlined' onPress={() => setExpanded(true)}>{props.title ?? 'Expand'}</Button>
    : props.children
    }
  </View>
)
}