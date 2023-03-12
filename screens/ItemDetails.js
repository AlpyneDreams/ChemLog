import { useTheme } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { Pressable, View } from 'react-native'
import { IconButton, Text, Button, Subheading, Headline, Title, Divider, ActivityIndicator, Snackbar } from 'react-native-paper'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import { Row } from '../components/Util'
import dayjs from 'dayjs'
import { CALENDAR_DATE_ONLY_COMPACT } from '../util/dayjs'
import SubstanceChip from '../components/substance/SubstanceChip'
import { ICON_ADD_NOTE } from '../util/Util'
import { Icon } from '../components/Icon'
import { HeaderTitle } from '@react-navigation/elements'
import Stat from '../components/Stat'
import { Dose } from '../store/Dose'
import DoseEntry from '../components/doses/DoseEntry'
import { ScrollView } from 'react-native-gesture-handler'
import DateGroupedList from '../components/DateGroupedList'
import * as Clipboard from 'expo-clipboard'
import Haptics from '../util/Haptics'

export default function ItemDetails({navigation, route}) {
  let item = route.params.dose ?? route.params.stash
  
  let [dialog, setDialog] = useState(false)

  const stash = route.params.stash
  const entry = ('dose' in route.params)
  const note = (item.type === 'note')
  const type = entry ? (note ? 'note' : 'dose') : 'stash'
  const icon = entry ? (note ? 'note' : 'beaker-outline') : 'archive'

  function deleteItem() {
    item.delete()
    navigation.navigate({name: entry ? 'DoseList' : 'StashList', params: { id: item.id, deleted: 1 }})
  }

  function edit(params = {}) {
    if (entry) {
      navigation.navigate(note ? 'EditNote' : 'EditDose', note ? {note: item, ...params} : {dose: item, ...params})
    } else {
      navigation.navigate('EditStash', {stash: item, ...params})
    }
  }


  React.useLayoutEffect(() => {

    navigation.setOptions({
      title: note ? 'Note' : item.name,
      headerTitle: (props) => <Row style={{paddingRight: 80}}>
        <Icon icon={icon} size={24} style={{marginTop: 2, marginRight: 6}} />
        <HeaderTitle {...props} />
      </Row>,
      headerRight: () => <Row>
        <IconButton icon='content-copy' onPress={() => item.createCopy(navigation)} />
        <IconButton icon='pencil' onPress={() => edit()} />
        <IconButton icon='delete' onPress={() => setDialog(true)} />
      </Row>
    })

  }, [navigation, route])

  let date = dayjs(item.date)
  const dateDate = date.calendar(null, CALENDAR_DATE_ONLY_COMPACT)
  const dateTime = date.format('HH:mm')

  const [copied, setCopied] = useState(false)

  // Long press notes to copy to clipboard
  let longPressNote = !!item.notes ? (() => {
    Haptics.longPress()
    Clipboard.setString(item.notes)
    setCopied(true)
  }) : (() => {})

  return (
  <ScrollView contentContainerStyle={{minHeight: '100%'}}>
    <View style={{padding: 16, height: '100%', paddingBottom: 60}}>
      {!note ? <>
        <Row>
          <Stat label='Substance'>
            <SubstanceChip substance={item.substance} style={{marginStart: 8}}/>
          </Stat>
        </Row>
        <Row>
          <Stat label='Amount' visible={item.amount} value={`${item.amount} ${item.unit}`} style={{flex: 1.4}} />
          <Stat label='Route' value={item.roa} style={{flex: 2}} />
        </Row>
      </> : null}
      <Row>
        <Stat label={entry ? 'When' : 'Created'} value={date.fromNow()} visible={date.isValid()} style={{flex: 1.4}} />
        <Stat label='Date' value={dateDate} visible={date.isValid()} />
        <Stat label='Time' value={dateTime} visible={date.isValid()} />
      </Row>
      <Row style={{flex: 1}}>
        <Pressable style={{flex: 1}} onLongPress={longPressNote}>
          <Stat label={note ? 'Note' : 'Notes'}>
            <Text style={{paddingLeft: 18, marginVertical: 6, fontSize: 15, lineHeight: 20}}>
              {
                item.notes 
                || <Button uppercase={false} icon={ICON_ADD_NOTE} onPress={() => edit({focus: 'notes'})}>
                  Add Notes
                </Button>
              }
            </Text>
          </Stat>
        </Pressable>
      </Row>
    </View>
    {!entry &&
      <StashDoses stash={stash} />
    }
    {/*<Card style={{padding: 16, elevation: 4}}>
      <Text>Substance Info</Text>
      </Card>*/}
    {/*<Text style={{fontFamily: 'monospace', color: useTheme().colors.text}}>{JSON.stringify(dose, null, 4)}</Text>*/}
    <ConfirmDialog title={`Delete this ${type}?`} acceptLabel='Delete' state={[dialog, setDialog]} onAccept={deleteItem} />
    <Snackbar visible={copied} duration={1000} onDismiss={() => setCopied(false)}>Copied note to clipboard.</Snackbar>
  </ScrollView>
  )
}

function StashDoses({stash}) {
  const theme = useTheme()
  const [doses, setDoses] = useState(null)

  useEffect(() => {
    setDoses(Dose.store.items.filter(d => d.substance === stash.substance)) // setDoses(stash.doses)
  }, [])

  if (doses && doses.length === 0) { // if (!stash.doses || stash.doses.length === 0)
    return null
  } else if (doses == null) {
    return <ActivityIndicator/>
  }

  // TODO: This code is the same as in DoseList
  return (
  <View style={{backgroundColor: null}}>
    <Divider/>
    <View style={{padding: 8, paddingBottom: 64}}>
      <Title style={{marginLeft: 8, marginBottom: 8}}>Doses</Title>
      <DateGroupedList
        items={doses}
        entry={(dose, index) =>
          <DoseEntry key={dose.id} dose={dose} index={index} elevated={true} />
        }
      />
    </View>
  </View>
  )
}