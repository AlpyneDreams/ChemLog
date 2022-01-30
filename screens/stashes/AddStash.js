import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, Text, FAB, List, Button, TextInput, useTheme } from 'react-native-paper'
import InputAmount from '../../components/inputs/InputAmount'
import InputDate from '../../components/inputs/InputDate'
import DropDown from 'react-native-paper-dropdown'
import { useNavigation } from '@react-navigation/native'
import { usePrevious } from '../../util/Util'
import InputSubstance from '../../components/inputs/InputSubstance'
import Substances from '../../store/Substances'
import { Stash } from '../../store/Stash'

export default function AddStash({route}) {
  const theme = useTheme()
  const navigation = useNavigation()

  const edit = false

  const [substance, setSubstance] = React.useState(null)
  const [nickname, setNickname] = React.useState(null)
  const [amount, setAmount]     = React.useState(null)
  const [unit, setUnit]         = React.useState('mg')

  function submit() {
    let data = {substance: substance.name, nickname, amount, unit}

    data.substanceName = substance.pretty_name

    if (!edit) {
      let stash = Stash.create(data)

      navigation.navigate({name: 'StashList', params: {id: stash.id}})

    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode='contained'
          style={{marginEnd: 8, borderRadius: 20}}
          uppercase={false}
          disabled={!substance}
          onPress={submit}
        >{!edit ? 'Add' : 'Save'}</Button>
      )
    })
  }, [substance])

  return (
    <View style={{ padding: 12, height: '100%' }}>
      <InputSubstance
        value={substance}
        onChange={({id, name}) => setSubstance(Substances[id])}
        returnTo={!edit ? 'AddStash' : 'EditStash'}
      />
      <TextInput
        label='Nickname'
        mode='outlined'
        style={{marginTop: 12}}
      />
      <TextInput
        label='Label'
        mode='outlined'
        style={{marginTop: 12}}
      />
      <InputAmount
        amount={amount}
        onChangeAmount={setAmount}
        unit={unit}
        onChangeUnit={setUnit}
        startOpen={true}
      />
      {/*<InputDate 
        value={null}
        onChange={date => this.setState({date})}
      />*/}
    </View>
  )
}
