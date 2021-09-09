import React from 'react'
import { ScrollView } from 'react-native'
import { RadioButton, Dialog, List, Portal, Divider } from 'react-native-paper'
import ChooseDialog from '../components/dialogs/ChooseDialog'
import UserData from '../store/UserData'
import Constants from 'expo-constants'

export default function Settings() {
  const {prefs: {darkTheme}, setDarkTheme} = UserData.useContext()

  const [themePicker, showThemePicker] = React.useState(false)

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
        <List.Item
          title='Version'
          description={Constants.manifest?.version ?? Constants.nativeAppVersion}
          onPress={() => {}}
        />
      </List.Section>
      
    </ScrollView>
  )
}