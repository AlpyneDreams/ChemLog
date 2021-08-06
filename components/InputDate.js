import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import InputExpand from './InputExpand'

export default function InputDate(props) {

  return (
    <View style={{flexDirection: 'row', ...props.style}}>
      <TextInput
        label='Time'
        style={{flex: 1, marginEnd: 8}}
      />
      <TextInput
        label='Date'
        style={{flex: 1}}
      />
    </View>
)
}