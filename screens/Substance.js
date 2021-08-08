import React from 'react'
import { View } from 'react-native'
import { Text, Title } from 'react-native-paper'

export default function SubstanceScreen({navigation, route}) {

  const {substance} = route.params || {substance: {properties: {}}}

  React.useLayoutEffect(() => navigation.setOptions({
    title: substance.pretty_name || 'Substance'
  }), [navigation, route])

  return (
    <View style={{padding: 20}}>
      <Text>{substance.properties.summary}</Text>
    </View>
  )

}