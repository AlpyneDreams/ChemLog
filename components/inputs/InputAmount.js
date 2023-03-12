import React, { useState } from 'react'
import { View } from 'react-native'
import { useTheme, Button, Menu, TextInput, TouchableRipple, Text, IconButton } from 'react-native-paper'
import DropDown from './DropDown'
import InputExpand from './InputExpand'
import Units from '../../data/Units'

const units = Object.values(Units)
  .filter(u => !u.hidden)
  .map(u => ({label: u.symbol, value: u.symbol}))

export default function InputAmount({startOpen = false, ...props}) {
  const {colors} = useTheme()
  const [unitMenu, showUnits] = useState(false)

  let placeholderColor = unitMenu ? colors.primary : colors.placeholder

  return (
    <InputExpand title='Add amount' icon='beaker' style={{paddingTop: 12}} buttonStyle={{marginTop: 8}} startOpen={startOpen}>
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
        <DropDown
          label='Unit'
          mode='flat'
          inputProps={{style: {backgroundColor: colors.background}, underlineColor: colors.outline}}
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