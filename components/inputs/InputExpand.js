import React, { useState } from 'react'
import { LayoutAnimation, View } from 'react-native'
import { Button, IconButton, TextInput, useTheme } from 'react-native-paper'
import { LayoutAnims } from '../../util/Util'

export default function InputExpand({startOpen = false, onExpand, buttonStyle, ...props}) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(startOpen)

  return (!expanded ?
    <Button
      icon={props.icon}
      uppercase={false}
      style={[{borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingVertical: 4}, buttonStyle]}
      contentStyle={{paddingVertical: 6, justifyContent: 'flex-start'}}
      onPress={() => {
        setExpanded(true)
        onExpand && onExpand()
      }}
    >
      {props.title ?? 'Expand'}
    </Button>
    :
    <View style={{flexDirection: 'row', ...props.style}}>
      {props.children}
    </View>
  )
}