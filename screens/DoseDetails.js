import React, { useState } from 'react'
import { View, Text, ToastAndroid } from 'react-native'
import { IconButton, Title, Snackbar } from 'react-native-paper'
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
      <Title>{dose.name}</Title>
      <Text style={{fontFamily: 'monospace'}}>{JSON.stringify(dose, null, 4)}</Text>
      <ConfirmDialog title='Delete this dose?' acceptLabel='Delete' state={[dialog, setDialog]} onAccept={deleteDose} />
    </View>
  )
}