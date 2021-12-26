import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, Text, FAB, List, IconButton, TextInput, useTheme } from 'react-native-paper'
import InputAmount from '../../components/InputAmount'
import InputDate from '../../components/InputDate'
import DropDown from 'react-native-paper-dropdown'

export default function AddStash({navigation}) {
  const theme = useTheme()

  const edit = true

  const [substance, setSubstance] = React.useState(null)

  return (
    <View style={{ padding: 12, height: '100%' }}>
      <DropDown
        label='Substance'
        mode='outlined'
        value={substance?.id}
        list={substance ? [{value: substance.id, label: substance.name}] : []}
        showDropDown={() => {
          navigation.navigate('SubstancePicker', {current: substance?.id, returnTo: !edit ? 'AddStash' : 'EditStash'})
        }}
      />
      <TextInput
        placeholder='Nickname'
        mode='outlined'
      />
      <TextInput
        placeholder='Label'
        mode='outlined'
      />
      <InputAmount
        amount={'0'}
        //onChangeAmount={amount => {}}
        unit={'mg'}
        //onChangeUnit={unit => this.setState({unit})}
        startOpen={true}
      />
      {/*<InputDate 
        value={null}
        onChange={date => this.setState({date})}
      />*/}
    </View>
  )
}
