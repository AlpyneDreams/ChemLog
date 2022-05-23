import React, { useState } from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import InputExpand from './InputExpand'
import ROA from '../../data/ROA'
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

roas.unshift({
  label: '(None)', value: null
})

export default function InputROA({value, onChange, startOpen = false}) {

  const [open, setOpen] = useState(false)

  const onExpand = () => {onChange(ROA.default)}

  return (
    <InputExpand title='Add route' icon='eyedropper' style={{paddingTop: 12}} startOpen={startOpen} onExpand={onExpand}>
      <View style={{flex: 1}}>
        <DropDown
          label='Route'
          mode='flat'
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