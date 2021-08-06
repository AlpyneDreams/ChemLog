import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import InputExpand from './InputExpand'

export default function InputAmount(props) {

  return (
    <InputExpand title='Add amount' style={{paddingTop: 12}}>
      <TextInput
        label='Amount'
        mode='contained'
        value={props.amount}
        onChangeText={props.onChangeAmount}
        style={{flex: 2, marginEnd: 8}}
      />
      <TextInput
        label='Unit'
        mode='contained'
        placeholder='mg'
        value={props.unit}
        onChangeText={props.onChangeUnit}
        style={{flex: 1}}
        right={<TextInput.Icon name='chevron-down' />}
      />
    </InputExpand>
)
}