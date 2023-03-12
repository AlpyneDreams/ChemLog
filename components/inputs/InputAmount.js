import React, { useState } from 'react'
import { View } from 'react-native'
import { useTheme, Button, Menu, TouchableRipple, Text, IconButton } from 'react-native-paper'
import InputExpand from './InputExpand'
import Units from '../../data/Units'
import { TextInput } from './TextInput'
import { ChooseDialog2 } from '../dialogs/ChooseDialog2'
import GenericInput from './GenericInput'

const units = Object.values(Units)
  .filter(u => !u.hidden)
  .map(u => ({label: u.symbol, value: u.symbol}))

export default function InputAmount({startOpen = false, ...props}) {
  const {colors} = useTheme()
  const [unitMenu, showUnits] = useState(false)

  return (
    <InputExpand title='Add amount' icon='beaker' style={{paddingTop: 12}} startOpen={startOpen}>
      <TextInput
        label='Amount'
        mode='flat'
        underlineColor={colors.outline}
        value={props.amount}
        autoFocus={!startOpen}
        keyboardType='numeric'
        onChangeText={amount => {
          if (!Number.isNaN(Number.parseFloat(amount)) || amount === '')
            props.onChangeAmount(amount)
        }}
        style={{flex: 1, marginEnd: 8, backgroundColor: colors.background}}
      />
      <View style={{flex: 1}}>
        <GenericInput
          label='Unit'
          mode='flat'
          value={props.unit}
          onPress={() => showUnits(true)}
          right={<TextInput.Icon icon='menu-down'/>}
        />
      </View>
      <ChooseDialog2
        state={[unitMenu, showUnits]}
        title='Unit' options={Units} clear={false}
        value={props.unit} onChange={props.onChangeUnit}
      />
    </InputExpand>
)
}