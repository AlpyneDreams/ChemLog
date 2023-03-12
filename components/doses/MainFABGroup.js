import React from 'react'
import { View, StyleSheet, LayoutAnimation } from 'react-native'
import { Card, FAB, Button, Text, Portal, Provider, useTheme, Surface, IconButton } from 'react-native-paper'
import Haptics from '../../util/Haptics'
import CommonStyles from '../CommonStyles'
import { Row } from '../Util'
import { LayoutAnims, usePrevious, ICON_ADD_NOTE } from '../../util/Util'
import { Icon } from '../Icon'

export default function MainFABGroup({visible, empty=false, addDose, addNote}) {
  const theme = useTheme()

  const wasVisible = usePrevious(visible)

  React.useEffect(() => {
    if (visible !== wasVisible) {
      LayoutAnimation.configureNext(LayoutAnims.ease)
    }
  })

  return (<>
    {empty &&
      <View style={{alignItems: 'flex-end', position: 'absolute', margin: 16, marginBottom: 24, right: 125, bottom: 20}}>
        <View style={{transform: [
          {rotateZ: '-8deg'}
        ]}}>
          <Text style={{color: theme.colors.onSurfaceVariant}}>Add Doses or Notes</Text>
        </View>
        <Icon icon={require('../../assets/icons/arrow-right-bottom.png')} size={24} color={theme.colors.disabled}/>
      </View>
    }
    <View style={CommonStyles.fab}>
      <FAB
        visible={visible}
        icon={ICON_ADD_NOTE}
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
  </>)
}
