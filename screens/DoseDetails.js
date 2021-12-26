import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, ToastAndroid } from 'react-native'
import { IconButton, Text, Snackbar, List, Chip, Card } from 'react-native-paper'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import { Row } from '../components/Util'
import dayjs from 'dayjs'
import { CALENDAR_DATE_ONLY_COMPACT } from '../util/dayjs'
import SubstanceChip from '../components/SubstanceChip'

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

  const note = (dose.type === 'note')

  function deleteDose() {
    dose.delete()
    //ToastAndroid.show('Dose deleted.', ToastAndroid.SHORT)
    navigation.navigate({name: 'DoseList', params: { id: dose.id, deleted: 1 }})
  }

  React.useLayoutEffect(() => {

    navigation.setOptions({
      title: note ? 'Note' : dose.name,
      headerRight: () => <Row>
        <IconButton icon='pencil' onPress={() => {
          navigation.navigate(note ? 'EditNote' : 'EditDose', note ? {note: dose} : {dose})
        }} />
        <IconButton icon='delete' onPress={() => {
          setDialog(true)
        }} />
      </Row>
    })

  }, [navigation, route])

  let date = dayjs(dose.date)

  return (
    <View style={{padding: 16}}>
      {!note ? <>
        <Row>
          <Stat label='Substance'>
            <SubstanceChip substance={dose.substance} />
          </Stat>
        </Row>
        <Row>
          <Stat label='Amount' visible={dose.amount} value={`${dose.amount} ${dose.unit}`} style={{flex: 1.25}} />
          <Stat label='Route' value={dose.roa} style={{flex: 2}} />
        </Row>
      </> : null}
      <Row>
        <Stat label='When' value={date.fromNow()} visible={date.isValid()} style={{flex: 1.25}} />
        <Stat label='Date' value={date.calendar(null, CALENDAR_DATE_ONLY_COMPACT)} visible={date.isValid()} />
        <Stat label='Time' value={date.format('HH:mm')} visible={date.isValid()} />
      </Row>
      <Row>
        {dose.notes ?
          <Stat label={note ? 'Note' : 'Notes'}>
            <Text style={{paddingLeft: 8, marginVertical: 6, fontSize: 15, lineHeight: 20}}>
              {dose.notes}
            </Text>
          </Stat>
        : null}
      </Row>
      {/*<Card style={{padding: 16, elevation: 4}}>
        <Text>Substance Info</Text>
        </Card>*/}
      {/*<Text style={{fontFamily: 'monospace', color: useTheme().colors.text}}>{JSON.stringify(dose, null, 4)}</Text>*/}
      <ConfirmDialog title='Delete this dose?' acceptLabel='Delete' state={[dialog, setDialog]} onAccept={deleteDose} />
    </View>
  )
}