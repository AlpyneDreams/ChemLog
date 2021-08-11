import { useTheme } from '@react-navigation/native'
import { setStatusBarStyle } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import substances from '../data/tripsit.drugs.json'

export default function SubstanceScreen({navigation, route}) {

  const theme = useTheme()
  let {substance, pickerMode, returnTo} = route.params || {substance: {properties: {}}}

  if (typeof substance === 'string') {
    substance = substances[substance]
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: substance.pretty_name || 'Substance',
      headerRight: () => 
        <Button
          uppercase={false}
          style={pickerMode ? {marginEnd: 8, borderRadius: 20} : {}}
          onPress={() => {
            navigation.navigate({
              name: pickerMode ? returnTo : 'AddDose', 
              params: {
                substance:{name: substance.pretty_name, id: substance.name},
              },
              merge: true
            })
          }}
        >{pickerMode ? 'Select' : 'New Dose'}</Button>
    })
    
    // In light theme, we need to invert the status bar
    // for TransitionPresets.ModalPresentationIOS
    if (!theme.dark) {
      setTimeout(() => {setStatusBarStyle('light')}, 100)

      return navigation.addListener('transitionStart', (e) => {
        if (e.data.closing)
          setStatusBarStyle('dark')
      })
    }

  }, [navigation, route])

  let aliases = substance.properties?.aliases ?? substance.aliases

  return (
    <View style={{paddingHorizontal: 20}}>

      {aliases ? 
        <Text style={{
          fontSize: 14, color: theme.colors.placeholder
        }}>{aliases.join(', ')}</Text>
      : null}

      <View style={{paddingVertical: 15}}>
        <Text>{substance.properties.summary}</Text>
      </View>
    </View>
  )

}