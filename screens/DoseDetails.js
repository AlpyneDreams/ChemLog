import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, ToastAndroid } from 'react-native'
import { IconButton, Text, Snackbar, List } from 'react-native-paper'
import ConfirmDialog from '../components/ConfirmDialog'
import { Row } from '../components/Util'
import dayjs from 'dayjs'

function Stat({label, value, ...props}) {
  return (value ? 
    <List.Section {...props}>
      <List.Subheader>{label}</List.Subheader>
      <List.Item title={value} />
    </List.Section> : null
  )
}

export default function DoseDetails({navigation, route}) {
  let dose = route.params
  
  let [dialog, setDialog] = useState(false)

  function deleteDose() {
    dose.delete()
    //ToastAndroid.show('Dose deleted.', ToastAndroid.SHORT)
    navigation.navigate('Home', {screen: 'DoseList', params: -(dose.id)})
  }

  React.useLayoutEffect(() => {

    navigation.setOptions({
      title: dose.name,
      headerRight: () => <Row>
        <IconButton icon='pencil' />
        <IconButton icon='delete' onPress={() => {
          setDialog(true)
        }} />
      </Row>
    })

  }, [navigation, route])

  let date = dayjs(dose.date)

  return (
    <View style={{padding: 16}}>
      <Row>
        <Stat label='Substance' value={dose.substance} />
        <Stat label='Amount' value={dose.amount} />
        <Stat label='Route' value={dose.roa} style={{flex: 1}} />
      </Row>
      <Row>
        <Stat label='When' value={date.fromNow()} visible={date.isValid()} style={{flex: 2}} />
        <Stat label='Date' value={date.calendar()} visible={date.isValid()} style={{flex: 2}} />
      </Row>
      <Stat label='Notes' value={dose.notes} />
      {/*<Text style={{fontFamily: 'monospace', color: useTheme().colors.text}}>{JSON.stringify(dose, null, 4)}</Text>*/}
      <ConfirmDialog title='Delete this dose?' acceptLabel='Delete' state={[dialog, setDialog]} onAccept={deleteDose} />
    </View>
  )
}