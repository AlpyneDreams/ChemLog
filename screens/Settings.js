import React, { useEffect } from 'react'
import { ScrollView, View, StyleSheet, Linking, Image } from 'react-native'
import { RadioButton, List, Divider, Text, useTheme, TextInput, ToggleButton } from 'react-native-paper'
import ChooseDialog from '../components/dialogs/ChooseDialog'
import UserData from '../store/UserData'
import Constants from 'expo-constants'
import { DevMenu } from './DevMenu'
import { useNavigation } from '@react-navigation/native'
import { Row } from '../components/Util'
import { Icon } from '../components/Icon'
import Switch from '../components/Switch'

function IconText({icon, children}) {
  return <Row>
    <Icon icon={icon} size={16} style={{marginTop: 2, marginRight: 4}} />
    <Text>{children}</Text>
  </Row>
}

export function Settings() {
  const navigation = useNavigation()
  const theme = useTheme()
  const {prefs: {darkTheme, screenLock, dataSource, compactDoseCards}, setDarkTheme, setDataSource, setCompactDoseCards} = UserData.useContext()

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
        <Divider/>
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
        <Divider/>
        <List.Item
          title='Theme'
        />
        <ToggleButton.Row value={darkTheme} onValueChange={setDarkTheme} style={styles.btnRow}>
          <ToggleButton icon={() => <Text>Default</Text>} value={null} style={{minWidth: 80}} />
          <ToggleButton icon={() => <IconText icon='brightness-4'>Dark</IconText>} value={true} style={{minWidth: 80}} />
          <ToggleButton icon={() => <IconText icon='brightness-7'>Light</IconText>} value={false} style={{minWidth: 80}} />
        </ToggleButton.Row>
        <List.Item
          title='Preferred Source'
          description='Default tab for substance dose and duration data'
        />
        <ToggleButton.Row value={dataSource} onValueChange={v => {if (!!v) setDataSource(v);}} style={styles.btnRow}>
          <ToggleButton icon={() => <Text>TripSit</Text>} value='tripsit' style={{minWidth: 80}} />
          <ToggleButton icon={() => <Text>PsychonautWiki</Text>} value='psychonaut' style={{minWidth: 120}} />
        </ToggleButton.Row>
        <List.Item
          title='Compact dose cards'
          description="Use compact layout in the dose list"
          right={() => 
            <Switch value={compactDoseCards} onValueChange={setCompactDoseCards} />
          }
          onPress={() => {setCompactDoseCards(!compactDoseCards)}}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>About</List.Subheader>
        <Divider/>
        <Version/>
        <Row>
          <List.Item style={{flex: 1}} title='Alpyne' description='Creator'/>
          <List.Item style={{flex: 1}} title='Mango Aphro' description='Logo Design'/>
        </Row>
        <List.Item
          title='Website' description='chemlog.app'
          left={() => <List.Icon icon={require('../assets/favicon.png')} color={theme.dark ? 'white' : 'black'}/>}
          onPress={() => Linking.openURL('https://chemlog.app')}
        />
        <List.Item
          title='GitHub'
          description='AlpyneDreams/ChemLog'
          left={() => <List.Icon icon='github'/>}
          onPress={() => Linking.openURL('https://github.com/AlpyneDreams/ChemLog')}
        />
        <List.Item
          title='PsychonautWiki'
          description='Substance information'
          left={() => <List.Icon icon='eye-circle-outline'/>}
          onPress={() => Linking.openURL('https://psychonautwiki.org/')}
        />
        <List.Item
          title='Tripsit'
          description='Substance information'
          left={() => <View><List.Icon icon={require('../assets/icons/tripsit.png')}/></View>}
          onPress={() => Linking.openURL('https://tripsit.me/')}
        />
        {devMenu && <DevMenu/>}
      </List.Section>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  btnRow: {
    marginLeft: 16, marginBottom: 16, marginTop: 2
  }
})