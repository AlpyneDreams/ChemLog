import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import InputExpand from './InputExpand'
import ROA from '../store/ROA'
import GenericInput from './GenericInput'

const roas = ROA.roas.map(roa => ({
  label: roa.name, value: roa.name,
  custom: (
    // TODO: DropDown sucks so we can't have the active color while also customizing the item.
    // Perhaps replace it altogether.
    <View>
      <Text>{roa.name}</Text>
      {roa.description ? <Text style={{opacity: 0.5}}>{roa.description}</Text> : null}
    </View>
  )
}))

export default function InputROA({value, onChange}) {

  const [open, setOpen] = useState(false)

  return (
    <InputExpand title='Route of administration' style={{paddingTop: 12}}>
      <View style={{flex: 1}}>
        <DropDown
          label='Route'
          dropDownContainerMaxHeight={300}
          visible={open}
          showDropDown={() => setOpen(true)}
          onDismiss={() => setOpen(false)}
          value={value}
          setValue={onChange}
          list={roas}
        />
      </View>
    </InputExpand>
  )
}