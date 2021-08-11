import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, ToastAndroid } from 'react-native'
import { IconButton, Text, Snackbar, List, Chip } from 'react-native-paper'
import ConfirmDialog from '../components/ConfirmDialog'
import { Row } from '../components/Util'
import dayjs from 'dayjs'
import { CALENDAR_DATE_ONLY_COMPACT } from '../util/dayjs'

function Stat({label, value, visible, children, style, ...props}) {
  return (((visible ?? value) ?? children) ? 
    <List.Section {...props} style={{flex: 1, ...style}}>
      <List.Subheader>{label}</List.Subheader>
      <List.Item title={value} left={() => children} titleNumberOfLines={2} />
    </List.Section> : null
  )
}

export default function DoseDetails({navigation, route}) {
  let {dose} = route.params
  
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
        <Stat label='Substance'>
          <Chip 
            mode='outlined'
            icon='pill'
            onPress={() => navigation.navigate('Substance', {substance: dose.substance})}
          >{dose.substanceName}</Chip>
        </Stat>
      </Row>
      <Row>
        <Stat label='Amount' visible={dose.amount} value={`${dose.amount} ${dose.unit}`} style={{flex: 1.25}} />
        <Stat label='Route' value={dose.roa} style={{flex: 2}} />
      </Row>
      <Row>
        <Stat label='When' value={date.fromNow()} visible={date.isValid()} style={{flex: 1.25}} />
        <Stat label='Date' value={date.calendar(null, CALENDAR_DATE_ONLY_COMPACT)} visible={date.isValid()} />
        <Stat label='Time' value={date.format('HH:mm')} visible={date.isValid()} />
      </Row>
      <Stat label='Notes' value={dose.notes} />
      {/*<Text style={{fontFamily: 'monospace', color: useTheme().colors.text}}>{JSON.stringify(dose, null, 4)}</Text>*/}
      <ConfirmDialog title='Delete this dose?' acceptLabel='Delete' state={[dialog, setDialog]} onAccept={deleteDose} />
    </View>
  )
}