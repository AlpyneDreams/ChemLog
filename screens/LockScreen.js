import React, { useEffect, useState, useRef } from 'react'
import { KeyboardAvoidingView, LayoutAnimation, Vibration, View } from 'react-native'
import { Button, Card, Headline, Surface, Title, useTheme, Text, ActivityIndicator, Dialog, Portal, TextInput, FAB, IconButton, ProgressBar } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from '../components/Icon'
import { useNavigation } from '@react-navigation/native'
import { Row } from '../components/Util'
import KeyStore from '../store/KeyStore'
import InputPasscode from '../components/inputs/InputPasscode'
import { StatusBar } from 'expo-status-bar'

export function lockScreen(navigation) {
  navigation.reset({index: 0, routes: [{name: 'LockScreen'}]})
}

export default function LockScreen({route}) {
  const navigation = useNavigation()
  const theme = useTheme()

  const txtRef = useRef(null)

  const prompting = route?.params?.prompt ?? false
  const returnTo  = prompting ? route.params?.returnTo ?? null : null
  const icon      = route?.params?.icon ?? 'lock'

  const [passcode, setPasscode] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(false)
  const [progress, setProgress] = useState(0)

  const [maxTries, setMaxTries] = useState(3)
  const [tries, setTries]       = useState(0)
  const [lockTime, setLockTime] = useState(5000)
  const [lockout, setLockout]   = useState(false)

  useEffect(() => {
    txtRef.current && txtRef.current.focus()
  })

  useEffect(() => {
    if (tries >= maxTries) {
      setTries(0)
      setMaxTries(1)
      setLockout(true)

      const timeout = lockTime
      setProgress(1)
      let progress = 1
      const interval = setInterval(() => {setProgress((progress -= 0.01))}, timeout / 100)
      setTimeout(() => {
        setLockout(false)
        setError(false)
        clearInterval(interval)

        // Increase next lockout time by 5 seconds up to 30 minutes
        setLockTime(Math.min(1800000, lockTime + 5000))
      }, timeout)
    }
  }, [tries])

  async function tryUnlock(passcode) {
    setError(false)
    setLoading(true)
    setProgress(0)

    const match = await KeyStore.checkHash('passcode', passcode, setProgress)
    if (!match) {
      setPasscode('')
      Vibration.vibrate(200)
      setError(true)
      setLoading(false)
      setTries(tries + 1)
      return
    }

    const dest = route?.params?.destination ?? 'Home'
    if (prompting) {
      navigation.pop()
      navigation.push(dest)
    } else {
      navigation.replace(dest)
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: theme.dark && theme.colors.surface, height: '100%'}}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} backgroundColor={theme.dark && theme.colors.surface} />
      {returnTo &&
        <IconButton icon='arrow-left' style={{top: 8, left: 8}} onPress={() => navigation.navigate(returnTo)}/>
      }
      <Card 
        style={{
          marginHorizontal: 32, marginTop: returnTo ? 96 : 128,
          backgroundColor: theme.colors.backdrop,
        }}
        mode='contained'
      >
        <Card.Content>
          <Row style={{justifyContent: 'center', alignItems: 'center', marginBottom: 32}}>
            {icon !== 'lock' && <Icon icon='lock' size={22} style={{left: -8}} />}
            <Headline>
              {prompting ? 'Enter Passcode' : 'Locked'}
            </Headline>
          </Row>
          {(icon || loading) && <View style={{
            backgroundColor: theme.dark ? '#3c0bde' : theme.colors.primary,
            width: 96,
            height: 96,
            marginBottom: 32,
            alignSelf: 'center',
            justifyContent: 'center', alignItems: 'center',
            borderRadius: 100
          }}>
            {loading ?
              <ActivityIndicator size={48} color='#fffa'/>
            :
              <Icon icon={icon} size={48} color='white' />
            }
          </View>}
          {/*<Text>{hash}</Text>*/}
          {(!lockout && !loading) ?
            <InputPasscode ref={txtRef} value={passcode} valid={passcode.length >= 4} onChange={setPasscode} submit={tryUnlock} />
            :
            <InputPasscode disabled={true} value={passcode} />
          }
          {/* Use while decrypting */}
          <ProgressBar progress={(loading || lockout) ? progress : 0} color={error ? theme.colors.error : null} style={{marginTop: 8}} />
        </Card.Content>
      </Card>
    </SafeAreaView>
  )
}