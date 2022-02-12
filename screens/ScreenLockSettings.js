import React from 'react'
import { ScrollView, InteractionManager } from 'react-native'
import { Dialog, List, Portal, useTheme, ActivityIndicator, HelperText, Button } from 'react-native-paper'
import UserData from '../store/UserData'
import { useNavigation } from '@react-navigation/native'
import KeyStore from '../store/KeyStore'
import InputPasscode from '../components/inputs/InputPasscode'
import { ListItem } from '../components/Util'
import dayjs from 'dayjs'
import ChooseDialog from '../components/dialogs/ChooseDialog'
import Switch from '../components/Switch'


export function ScreenLockSettings() {
  const theme = useTheme()
  const navigation = useNavigation()
  const {prefs: {screenLock, autoLock}, setScreenLock, setAutoLock} = UserData.useContext()

  const [error, setError] = React.useState(null)
  const [prompt, setPrompt] = React.useState(0)
  const [changing, setChanging] = React.useState(false)
  const [match, setMatch] = React.useState('')
  const [pin, setPin] = React.useState('')

  const [loading, setLoading] = React.useState(false)

  function setEnabled(enabled) {
    setScreenLock(enabled)
    if (enabled)
      setPrompt(1)
    else
      KeyStore.delete('passcode')
  }

  function confirmPin(passcode) {
    setError(null)
    if (prompt === 1) {
      setMatch(pin)
      setPin('')
      setPrompt(2)
      return
    }

    // Passcodes didn't match
    if (pin !== match) {
      setPin(''); setMatch('')
      setError("Passcodes didn't match")
      setPrompt(1)
      return
    }

    // Valid Passcode:

    setPin(''); setMatch('')
    setPrompt(0)
    setChanging(false)
    setLoading(true)

    InteractionManager.setDeadline(100)
    InteractionManager.runAfterInteractions(() => {
      KeyStore.setHash('passcode', passcode, 8).then(() => {
        setLoading(false)
      })
    })
  }

  function cancel() {
    if (!changing) {
      setScreenLock(false)
    }
    setChanging(false)
    setPrompt(0)
  }

  return (
    <ScrollView>
      <List.Section>
        <List.Item
          title='Screen lock'
          description={error ?? 'Lock app with passcode'}
          descriptionStyle={error !== null ? {color: theme.colors.error} : null}
          right={() => 
            <Switch value={screenLock} onValueChange={setEnabled} />
          }
          onPress={() => {setEnabled(!screenLock)}}
        />
        <ListItem
          title='Change passcode' disabled={!screenLock}
          onPress={() => {setChanging(true); setEnabled(true)}}
          right={() => loading && <ActivityIndicator />}
        />
        <AutoLockSettings enabled={screenLock} value={autoLock} onChange={setAutoLock} />
      </List.Section>
      <Portal key='passcode-prompt'>
        <Dialog
          visible={prompt > 0}
          onDismiss={cancel}
        >
            <Dialog.Title>{prompt >= 2 ? 'Confirm' : 'Enter New'} Passcode</Dialog.Title> 
            <Dialog.Content>
              <InputPasscode submit={confirmPin} value={pin} valid={pin.length >= 4} onChange={setPin} secure={false} icon='check' />
              {error && <HelperText type='error' style={{marginBottom: -24}}>{error}</HelperText>}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={cancel}>Cancel</Button>
            </Dialog.Actions>
        </Dialog> 
      </Portal> 
      
    </ScrollView>
  )
}

function AutoLockSettings({enabled, value, onChange}) {
  const [picker, showPicker] = React.useState(false)

  let description = 'Lock screen after a period of inactivity'
  if (value > 0) {
    description = `Lock screen after ${dayjs.duration(value).humanize()} of inactivity`
  } else if (value === 0) {
    description = 'Lock screen immediately when inactive'
  } else if (value < 0) {
    description = `Off`
  }

  return (<>
    <ListItem
      title='Auto-lock' disabled={!enabled}
      description={description}
      onPress={() => showPicker(true)}
    />
    <ChooseDialog
      title='Auto-lock'
      state={[picker, showPicker]}
      options={{
        'Immediately':  0,
        '1 minute':     1 * 1000 * 60,
        '5 minutes':    5 * 1000 * 60,
        '1 hour':      60 * 1000 * 60,
        'Off':         -1,
      }}
      value={value} onChange={onChange}
    />
  </>)
}