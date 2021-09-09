import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, FAB, Portal, Provider, useTheme, Colors } from 'react-native-paper'
import Haptics from '../util/Haptics'

export default function MainFABGroup({visible, addDose, addNote}) {
  const [open, setOpen] = React.useState(false)

  return (<>
    <FAB.Group
      open={open}
      style={{paddingBottom: 8}}
      icon={open ? 'close' : 'plus'}
      actions={[
        {label: 'Note', icon: 'note-outline', onPress: addNote},
        {label: 'Dose', icon: 'beaker-outline', onPress: addDose},
      ]}
      onStateChange={({open}) => setOpen(open)}
    />
    {!open && // Invisible FAB detects long presses
      <FAB
        style={[styles.container, {backgroundColor: 'transparent', elevation: 0}]}
        onPress={() => setOpen(!open)}
        onLongPress={() => {
          if (!open) {
            Haptics.longPress()
            addDose()
          }
        }}
      />
    }
  </>)


  /* // Alternative: Two FABs
  return (
    <View style={styles.container}>
      <FAB
        icon='note'
        style={{marginBottom: 16, backgroundColor: theme.colors.surface}}
        color={theme.dark ? '#f9e063' : '#eac300'}
        onPress={addNote}
      />
      <FAB
        icon='plus'
        onPress={addDose}
      />
    </View>
  )
  */
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    margin: 16,
    marginBottom: 24,
    right: 0,
    bottom: 0
  }
})
