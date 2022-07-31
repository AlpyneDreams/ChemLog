import React from 'react'
import { Alert, DevSettings, Share, View } from 'react-native'
import { RadioButton, Dialog, List, Portal, Divider, Text, TextInput, useTheme } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Substances from '../store/Substances'
import { useNavigation } from '@react-navigation/native'

// TODO: There was already a dev menu implemented in a git stash on
// another computer somewhere. There was also a version with import/export.
// This version is really just a messy hack.

export function DevMenu() {
  const theme = useTheme()
  const navigation = useNavigation()
  
  // Dump the entire data store
  const [keys, setKeys] = React.useState([])
  const [values, setValues] = React.useState({})
  React.useEffect(() => {
    if (keys.length === 0)
      AsyncStorage.getAllKeys().then(_keys => {
        setKeys(_keys)
        AsyncStorage.multiGet(_keys).then(stores => {
          setValues(stores.map(s => JSON.parse(s[1])))
        })
      })
  })

  const [data, setData] = React.useState(null)

  return (
    <View style={{marginTop: 1000}}>
      <List.Subheader>Developer Settings</List.Subheader>

      {/* List all data stores */}
      {keys.map(key => <View key={key}>
        <Divider style={{backgroundColor: theme.colors.text, marginTop: 8}}/>
        <List.Item title={key} titleStyle={{fontWeight: 'bold'}} />
        <Text style={{fontFamily: 'monospace'}}>
          {JSON.stringify(values[keys.indexOf(key)], null, 2)}
        </Text>
      </View>)}

      <Divider style={{backgroundColor: theme.colors.text, marginTop: 8}}/>

      <List.Item
        title="Run Through Substances"
        description="This will rapid-fire render every substance's page. Restart app to cancel."
        onPress={() => {
          let i = 0
          let list = Object.values(Substances)
          setInterval(() => {
            if (i >= list.length)
              return clearInterval(this)
            const substance = list[i++]
            console.log(substance.name)
            navigation.navigate('Substance', {substance})
          }, 300)
        }}
      />
      
      <List.Item
        title="Export Data"
        onPress={() => {
          const expt = Object.fromEntries( keys.map((k, i) => [k, values[i]]) )
          Share.share({message: JSON.stringify(expt)})
        }}
      />

      <TextInput
        placeholder='Paste Data To Import'
        value={data}
        onChangeText={value => setData(value)}
        multiline={true}
        mode='outlined'
        style={{margin: 8}}
      />

      <List.Item
        title="Import Data"
        onPress={() => {
          Alert.alert('Import Data?', 'This will OVERWRITE all existing data.', [
            {text: 'Nevermind'},
            {text: 'Ok', onPress: () => {
              const stores = JSON.parse(data)
              AsyncStorage.multiRemove(keys).then(() => {
                AsyncStorage.multiSet(Object.entries(stores).map(([key, value]) => [key, JSON.stringify(value)]))
                DevSettings.reload()
              })
            }}
          ])
        }}
      />

      <Divider style={{backgroundColor: theme.colors.text, marginTop: 8}}/>

      <List.Item
        title="NUCLEAR OPTION" description="Long press to delete all data" titleStyle={{color: 'red'}}
        onPress={() => {}}
        onLongPress={() => {
          Alert.alert('DELETE EVERYTHING?', 'Are you sure?', [
            {text: 'Nevermind'},
            {text: 'Ok', onPress: () => {
              AsyncStorage.multiRemove(keys).then(() => DevSettings.reload())
            }}
          ])
        }}
      />
    </View>
  )
}
