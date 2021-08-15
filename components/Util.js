import React from 'react'
import { View, ViewProps } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

/**
 * @param {ViewProps} props
 */
export function Row(props) {
  return <View
    {...props}
    style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      ...props.style
    }}
  />
}

export function CloseBackButton({navigation}) {
  navigation = navigation ?? useNavigation()
  return <IconButton icon='close' onPress={() => navigation.goBack()}/>
}
