import React from 'react'
import { View, StyleSheet, LayoutAnimation } from 'react-native'
import { Card, FAB, Button, Text, Portal, Provider, useTheme, Colors, Surface, IconButton } from 'react-native-paper'
import Haptics from '../util/Haptics'
import CommonStyles from '../components/CommonStyles'
import { Row } from './Util'
import { LayoutAnims, usePrevious } from '../util/Util'

const ICON_NOTE_PLUS = require('../assets/icons/note-plus-outline.png')

function BigButton({icon, label, small = false, background, color = 'white', ...props}) {
  return (
    <FAB
      icon={icon}
      uppercase={false}
      label={!small && label}
      small={small}
      style={{
        backgroundColor: background,
        borderRadius: 16,
        paddingHorizontal: 8,
      }}
      {...props}
    />
  )
}

export default function MainFABGroup({visible, moveUp, addDose, addNote}) {
  const theme = useTheme()

  const wasVisible = usePrevious(visible)
  const wasMovedUp = usePrevious(moveUp)

  React.useEffect(() => {
    if (visible !== wasVisible) {
      LayoutAnimation.configureNext(LayoutAnims.ease)
    }
    if (moveUp !== wasMovedUp) {
      LayoutAnimation.configureNext({
        ...LayoutAnims.ease,
        duration: 100
      })
    }
  })

  if (!visible) return <></>

  // Primary: #7855ed (Complement: #8D7EBF)
  // Yellow: #dac503

  return(
    <Row style={[{
      zIndex: 100,
      justifyContent: 'space-evenly',
      //backgroundColor: theme.colors.background,
    },
    !moveUp ? {
      position: 'relative',
      //position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8,
      //borderTopLeftRadius: 16, borderTopRightRadius: 16,
      //borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    } : {
      position: 'absolute', top: -50, left: 0, right: 0,
      paddingTop: 4,
      marginHorizontal: '30%'
    }]}>
      <BigButton
        icon={ICON_NOTE_PLUS}
        label='Note'
        visible={visible}
        small={moveUp}
        color='#000000AA'
        background={theme.dark ? '#8D7EBF' : '#d8ccff'}
        onPress={addNote}
      />

      <BigButton
        icon='beaker-plus-outline'
        label='Dose'
        visible={visible}
        small={moveUp}
        background={theme.colors.primary}
        onPress={addDose}
      />
    </Row>
  )
}
