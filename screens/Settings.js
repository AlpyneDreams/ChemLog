import React from 'react'
import { ScrollView } from 'react-native'
import { RadioButton, Dialog, List, Portal, Divider } from 'react-native-paper'
import ChooseDialog from '../components/dialogs/ChooseDialog'
import UserData from '../store/UserData'
import Constants from 'expo-constants'
import { DevMenu } from './DevMenu'

export default function Settings() {
  const {prefs: {darkTheme}, setDarkTheme} = UserData.useContext()

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

