import React, { useEffect } from 'react'
import { ScrollView, Platform } from 'react-native'
import { RadioButton, List, Divider, Text, useTheme, TextInput, FAB } from 'react-native-paper'
import ChooseDialog from '../components/dialogs/ChooseDialog'
import UserData from '../store/UserData'
import Constants from 'expo-constants'
import { DevMenu } from './DevMenu'
import { useNavigation } from '@react-navigation/native'
import { Row } from '../components/Util'

export function Settings() {
  const navigation = useNavigation()
  const theme = useTheme()
  const {prefs: {darkTheme, screenLock}, setDarkTheme} = UserData.useContext()

  const [themePicker, showThemePicker] = React.useState(false)
  const [devMenu, setDevMenu] = React.useState(false)

  function Version() {
    const [knocks, setKnocks] = React.useState(0)
    return (
      <List.Item
        title='Version'
        description={Constants.manifest?.version ?? Constants.nativeAppVersion}
        onPress={() => {
          setKnocks(knocks+1)
          if (knocks+1 >= 4) {
            setDevMenu(true)
          }
        }}
      />
    )
  }
  
  return (
    <ScrollView>
      <List.Section>
        <List.Subheader>Security</List.Subheader>
        <List.Item
          title='Screen lock'
          description={`Lock app with passcode`}
          onPress={() => {
            if (screenLock) {
              navigation.navigate('LockScreen', {destination: 'ScreenLockSettings', prompt: true, returnTo: 'Settings', icon: 'cog'})
            } else {
              navigation.navigate('ScreenLockSettings')
            }
          }}
        />
      </List.Section>
      
      <List.Section>
        <List.Subheader>General</List.Subheader>
        <List.Item
          title='Theme'
          description={darkTheme ? 'Dark' : (darkTheme == null ? 'System default' : 'Light')}
          onPress={() => showThemePicker(true)}
        />
        <ChooseDialog
          title='Choose theme'
          state={[themePicker, showThemePicker]}
          options={{
            Light: false, Dark: true, 'System default': null
          }}
          value={darkTheme}
          onChange={setDarkTheme}
        />
        <Divider/>
        <Version/>
        {devMenu && <DevMenu/>}
      </List.Section>
      
    </ScrollView>
  )
}

