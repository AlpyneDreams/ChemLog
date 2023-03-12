import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Caption, Text, useTheme } from 'react-native-paper'
import InputExpand from './InputExpand'
import ROA from '../../data/ROA'
import GenericInput from './GenericInput'
import { TextInput } from './TextInput'
import { ChooseDialog2 } from '../dialogs/ChooseDialog2'
import { RadioChips } from './RadioChips'
import QuickDoses from '../../store/QuickDoses'

const roas = {}
for (const roa of ROA.roas) {
  roas[roa.name] = roa
}

export default function InputROA({value, substance, onChange, startOpen = false, bgColor}) {
  const theme = useTheme()
  const [open, setOpen] = useState(!startOpen)

  const onExpand = () => {onChange(ROA.default)}

  if (0) return (
    <InputExpand title='Add route' icon='eyedropper' style={{paddingTop: 12}} startOpen={startOpen} onExpand={onExpand}>
      <View style={{flex: 1}}>
        <GenericInput
          label='Route'
          mode='flat'
          value={value}
          onPress={() => setOpen(true)}
          right={<TextInput.Icon icon='menu-down'/>}
          inputStyle={{backgroundColor: bgColor}}
        />
      </View>
      <ChooseDialog2
        state={[open, setOpen]}
        title='Route' value={value} onChange={onChange}
        options={roas}
      />
    </InputExpand>
  )

  const roaList = QuickDoses.getROAs(substance)

  return (
    <InputExpand title='Add route' icon='eyedropper' style={{paddingTop: 12}} startOpen={startOpen} onExpand={onExpand}>
      <View style={{flex: 1}}>
      <RadioChips
        label={value ? 'Route' : 'Choose Route'}
        options={roaList} dependents={[substance]}
        value={value} onChange={onChange}
        findMore={() => setOpen(true)}
        nameKey='displayName'
      />
      </View>
      <ChooseDialog2
        state={[open, setOpen]}
        title='Route' value={value} onChange={(name, value) => onChange(value ? {...value, displayName: value.name} : value)}
        options={roas}
      />
    </InputExpand>
  )
}

const styles = StyleSheet.create({
  chip: {marginRight: 6, marginVertical: 4, maxHeight: 36}
})
