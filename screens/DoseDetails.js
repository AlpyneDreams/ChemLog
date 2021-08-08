import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, Text, ToastAndroid } from 'react-native'
import { IconButton, Title, Snackbar, List } from 'react-native-paper'
import ConfirmDialog from '../components/ConfirmDialog'
import { Row } from '../components/Util'
import Dose from '../store/Dose'

export default function DoseDetails({navigation, route}) {
  let dose = route.params
  
  let [dialog, setDialog] = useState(false)

  function deleteDose() {
    dose.delete()
    //ToastAndroid.show('Dose deleted.', ToastAndroid.SHORT)
    navigation.navigate('Home', -(dose.id))
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

  return (
    <View style={{padding: 16}}>
      <View style={{flexDirection: 'row'}}>
        <List.Section>
          <List.Subheader>Substance</List.Subheader>
          <List.Item title={dose.substance} />
        </List.Section>
        {dose.amount ? 
          <List.Section>
            <List.Subheader>Amount</List.Subheader>
            <List.Item title={`${dose.amount} ${dose.unit}`} />
          </List.Section> : null}
        {dose.roa ? 
          <List.Section>
            <List.Subheader>Route</List.Subheader>
            <List.Item title={dose.roa} />
          </List.Section> : null}

      </View>
      {dose.notes ? 
        <List.Section>
          <List.Subheader>Notes</List.Subheader>
          <List.Item title={dose.notes} />
        </List.Section> : null}
      {/*<Text style={{fontFamily: 'monospace', color: useTheme().colors.text}}>{JSON.stringify(dose, null, 4)}</Text>*/}
      <ConfirmDialog title='Delete this dose?' acceptLabel='Delete' state={[dialog, setDialog]} onAccept={deleteDose} />
    </View>
  )
}