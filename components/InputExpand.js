import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

export default function InputExpand({startOpen = false, ...props}) {
  const [expanded, setExpanded] = useState(startOpen)

  return (
    <View style={{flexDirection: 'row', ...props.style}}>
    {!expanded
    ? <Button
        icon={props.icon}
        mode='outlined'
        uppercase={false}
        onPress={() => setExpanded(true)}
      >{props.title ?? 'Expand'}</Button>
    : props.children
    }
  </View>
)
}