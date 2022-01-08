import React from 'react'
import { View, StyleSheet, LayoutAnimation } from 'react-native'
import { Card, FAB, Button, Text, Portal, Provider, useTheme, Colors, Surface, IconButton } from 'react-native-paper'
import Haptics from '../util/Haptics'
import CommonStyles from '../components/CommonStyles'
import { Row } from './Util'
import { LayoutAnims, usePrevious } from '../util/Util'

const ICON_NOTE_PLUS = require('../assets/icons/note-plus-outline.png')

export default function MainFABGroup({visible, addDose, addNote}) {
  const theme = useTheme()

  const wasVisible = usePrevious(visible)

  React.useEffect(() => {
    if (visible !== wasVisible) {
      LayoutAnimation.configureNext(LayoutAnims.ease)
    }
  })

  return (
    <View style={CommonStyles.fab}>
      <FAB
        visible={visible}
        icon={ICON_NOTE_PLUS}
        label='Note'
        uppercase={false}
        style={{marginBottom: 16, backgroundColor: theme.dark ? '#8D7EBF' : '#d8ccff'}}
        color={'#000000AA'}
        onPress={addNote}
      />
      <FAB
        visible={visible}
        icon='beaker-plus-outline'
        label='Dose'
        uppercase={false}
        style={{backgroundColor: theme.colors.primary}}
        onPress={addDose}
      />
    </View>
  )
}
