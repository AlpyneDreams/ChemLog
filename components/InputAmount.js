import React, { useState } from 'react'
import { View } from 'react-native'
import { useTheme, Button, Menu, TextInput, TouchableRipple, Text, IconButton } from 'react-native-paper'
import InputExpand from './InputExpand'
import UNITS from '../store/Units'

export default function InputAmount(props) {
  const {colors} = useTheme()
  const [units, showUnits] = useState(false)

  const selectUnit = (unit) => function(e) {
    props.onChangeUnit(unit)
    showUnits(false)
  }

  let placeholderColor = units ? colors.primary : colors.placeholder

  return (
    <InputExpand title='Add amount' icon='beaker' style={{paddingTop: 12}}>
      <TextInput
        label='Amount'
        mode='contained'
        value={props.amount}
        keyboardType='numeric'
        onChangeText={props.onChangeAmount}
        style={{flex: 1, marginEnd: 8}}
      />
      <View style={{flex: 1}}>
        <Menu
          visible={units} onDismiss={() => showUnits(false)}
          style={{paddingTop: 64}}
          anchor={
            // TODO: This is a placeholder for a real dropdown. Although, it does work...
            <TouchableRipple 
              icon='chevron-down' mode='outlined' uppercase={false}
              onPress={() => showUnits(true)}
              style={{
                height: 64, paddingStart: 12, paddingTop: 8,
                borderBottomWidth: units ? 2 : 1,
                borderBottomColor: units ? colors.primary : colors.disabled
              }}
            >
              <View>
                <Text style={{
                  fontSize: 12,
                  color: placeholderColor
                }}>Unit</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6}}>
                  <Text style={{fontSize: 16}}>{props.unit}</Text>
                  <IconButton icon='chevron-down' style={{marginTop: -8}} color={placeholderColor}/>
                </View>
              </View>
            </TouchableRipple>
            /*<TouchableRipple
              onPress={() => showUnits(true)}
            >
              <TextInput
                label='Unit'
                mode='contained'
                placeholder='mg'
                onFocus={() => showUnits(true)}
                value={props.unit}
                style={{zIndex: 100}}
                right={<TextInput.Icon name='chevron-down' />}
              />
            </TouchableRipple>*/
          }
        >
          {Object.values(UNITS).map(u => {
            if (!u.hidden) {
              return (
                <Menu.Item
                  key={u.symbol}
                  title={`${u.name} (${u.symbol})`}
                  onPress={selectUnit(u.symbol)}
                  style={{backgroundColor: props.unit === u.symbol ? 'rgba(127, 127, 127, 0.2)' : null}}
                />
              )
            }
          })}
        </Menu>
      </View>
    </InputExpand>
)
}