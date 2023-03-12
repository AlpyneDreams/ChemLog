import React, { useState } from 'react'
import { View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import InputExpand from './InputExpand'
import ROA from '../../data/ROA'
import GenericInput from './GenericInput'
import { TextInput } from './TextInput'
import { ChooseDialog2 } from '../dialogs/ChooseDialog2'

const roas = {}
for (const roa of ROA.roas) {
  roas[roa.name] = roa
}

export default function InputROA({value, onChange, startOpen = false}) {
  const theme = useTheme()
  const [open, setOpen] = useState(!startOpen)

  const onExpand = () => {onChange(ROA.default)}

  return (
    <InputExpand title='Add route' icon='eyedropper' style={{paddingTop: 12}} startOpen={startOpen} onExpand={onExpand}>
      <View style={{flex: 1}}>
        <GenericInput
          label='Route'
          mode='flat'
          value={value}
          onPress={() => setOpen(true)}
          right={<TextInput.Icon icon='menu-down'/>}
        />
      </View>
      <ChooseDialog2
        state={[open, setOpen]}
        title='Route' value={value} onChange={onChange}
        options={roas}
      />
    </InputExpand>
  )
}

