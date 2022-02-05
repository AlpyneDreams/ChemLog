import React from 'react'
import { ScrollView, Switch, InteractionManager } from 'react-native'
import { Dialog, List, Portal, useTheme, ActivityIndicator, HelperText, Button } from 'react-native-paper'
import UserData from '../store/UserData'
import { useNavigation } from '@react-navigation/native'
import KeyStore from '../store/KeyStore'
import InputPasscode from '../components/inputs/InputPasscode'


export function ScreenLockSettings() {
  const theme = useTheme()
  const navigation = useNavigation()
  const {prefs: {screenLock}, setScreenLock} = UserData.useContext()

  const [error, setError] = React.useState(null)
  const [prompt, setPrompt] = React.useState(0)
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
    setLoading(true)

    InteractionManager.setDeadline(100)
    InteractionManager.runAfterInteractions(() => {
      KeyStore.setHash('passcode', passcode, 8).then(() => {
        setLoading(false)
      })
    })
  }

  return (
    <ScrollView>
      <List.Section>
        <List.Item
          title='Screen lock'
          description={error ?? 'Lock app with passcode'}
          descriptionStyle={error !== null ? {color: theme.colors.error} : null}
          right={() => 
            <Switch
              value={screenLock}
              onValueChange={setEnabled}
              trackColor={{false: theme.colors.disabled, true: theme.colors.accent+'55'}}
            />
          }
          onPress={() => {setEnabled(!screenLock)}}
        />
        {screenLock && <List.Item
          title='Change passcode'
          onPress={() => setEnabled(true)}
          right={() => loading && <ActivityIndicator />}
        />}
      </List.Section>
      <Portal key='passcode-prompt'>
        <Dialog
          visible={prompt > 0}
          onDismiss={() => {
            setScreenLock(false)
            setPrompt(false)
          }}
        >
            <Dialog.Title>{prompt >= 2 ? 'Confirm' : 'Enter New'} Passcode</Dialog.Title> 
            <Dialog.Content>
              <InputPasscode submit={confirmPin} value={pin} valid={pin.length >= 4} onChange={setPin} secure={false} icon='check' />
              {error && <HelperText type='error' style={{marginBottom: -24}}>{error}</HelperText>}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setPrompt(0)}>Cancel</Button>
            </Dialog.Actions>
        </Dialog> 
      </Portal> 
      
    </ScrollView>
  )
}
