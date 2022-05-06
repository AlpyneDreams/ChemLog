import React, { useEffect } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { RadioButton, List, Divider, Text, useTheme, TextInput, ToggleButton } from 'react-native-paper'
import ChooseDialog from '../components/dialogs/ChooseDialog'
import UserData from '../store/UserData'
import Constants from 'expo-constants'
import { DevMenu } from './DevMenu'
import { useNavigation } from '@react-navigation/native'
import { Row } from '../components/Util'
import { Icon } from '../components/Icon'

function IconText({icon, children}) {
  return <Row>
    <Icon icon={icon} size={16} style={{marginTop: 2, marginRight: 4}} />
    <Text>{children}</Text>
  </Row>
}

export function Settings() {
  const navigation = useNavigation()
  const theme = useTheme()
  const {prefs: {darkTheme, screenLock, dataSource}, setDarkTheme, setDataSource} = UserData.useContext()

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
          onPress={() => showThemePicker(true)}
        />
        <ToggleButton.Row value={darkTheme} onValueChange={setDarkTheme} style={styles.btnRow}>
          <ToggleButton icon={() => <Text>Default</Text>} value={null} style={{minWidth: 80}} />
          <ToggleButton icon={() => <IconText icon='brightness-4'>Dark</IconText>} value={true} style={{minWidth: 80}} />
          <ToggleButton icon={() => <IconText icon='brightness-7'>Light</IconText>} value={false} style={{minWidth: 80}} />
        </ToggleButton.Row>
        <ChooseDialog
          title='Choose theme'
          state={[themePicker, showThemePicker]}
          options={{
            Light: false, Dark: true, 'System default': null
          }}
          value={darkTheme}
          onChange={setDarkTheme}
        />
        <List.Item
          title='Preferred Source'
          description='Default tab for substance dose and duration data'
        />
        <ToggleButton.Row value={dataSource} onValueChange={v => {if (!!v) setDataSource(v);}} style={styles.btnRow}>
          <ToggleButton icon={() => <Text>TripSit</Text>} value='tripsit' style={{minWidth: 80}} />
          <ToggleButton icon={() => <Text>Psychonaut</Text>} value='psychonaut' style={{minWidth: 100}} />
        </ToggleButton.Row>
        <Divider/>
        <Version/>
        {devMenu && <DevMenu/>}
      </List.Section>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  btnRow: {
    marginLeft: 16, marginBottom: 24, marginTop: 2
  }
})