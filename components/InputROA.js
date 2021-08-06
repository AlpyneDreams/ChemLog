import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import InputExpand from './InputExpand'

export default function InputROA() {

  return (
    <InputExpand title='Route of administration' style={{paddingTop: 12}}>
      <TextInput
        label='Route'
        mode='contained'
        style={{flex: 2}}
      />
    </InputExpand>
  )
}