import { useTheme } from '@react-navigation/native'
import { setStatusBarStyle } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

export default function SubstanceScreen({navigation, route}) {

  const theme = useTheme()
  const {substance} = route.params || {substance: {properties: {}}}


  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: substance.pretty_name || 'Substance'
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