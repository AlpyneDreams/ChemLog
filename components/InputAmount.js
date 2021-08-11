import React, { useState } from 'react'
import { View } from 'react-native'
import { useTheme, Button, Menu, TextInput, TouchableRipple, Text, IconButton } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import InputExpand from './InputExpand'
import Units from '../store/Units'

const units = Object.values(Units)
  .filter(u => !u.hidden)
  .map(u => ({label: u.symbol, value: u.symbol}))

export default function InputAmount({startOpen = false, ...props}) {
  const {colors} = useTheme()
  const [unitMenu, showUnits] = useState(false)

  let placeholderColor = unitMenu ? colors.primary : colors.placeholder

  return (
    <InputExpand title='Add amount' icon='beaker' style={{paddingTop: 12}} startOpen={startOpen}>
      <TextInput
        label='Amount'
        mode='contained'
        value={props.amount}
        keyboardType='numeric'
        onChangeText={props.onChangeAmount}
        style={{flex: 1, marginEnd: 8}}
      />
      <View style={{flex: 1}}>
        <DropDown
          label='Unit'
          visible={unitMenu}
          showDropDown={() => showUnits(true)}
          onDismiss={() => showUnits(false)}
          setValue={props.onChangeUnit}
          value={props.unit}
          list={units}
        />
      </View>
    </InputExpand>
)
}