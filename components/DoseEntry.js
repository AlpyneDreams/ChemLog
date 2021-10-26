import React, { Component, useState } from 'react'
import { View, Text as RText, StyleSheet, ToastAndroid, Vibration } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, List, Card, TouchableRipple, useTheme, Checkbox, IconButton } from 'react-native-paper'
import dayjs from 'dayjs'
import { Row } from './Util'
import { LOCALE_COMPACT } from '../util/dayjs'
import { getMainCategory } from '../data/Categories'
import Substances from '../data/tripsit.drugs.json'

export default function DoseEntry({dose, index, selecting, list}) {
  const theme = useTheme() 
  const navigation = useNavigation()
  const [selected, setSelected] = useState(false)

  const note = (dose.type === 'note')
  const date = dayjs(dose.date).locale(LOCALE_COMPACT)

  const hooks = {id: index, setSelected, delete: dose.delete.bind(dose)}

  React.useEffect(() => {
    list.state.selectableItems.add(hooks)
    return () => {
      list.state.selectableItems.delete(hooks)
    }
  }, [])

  const onPress = () => {
    if (!selecting) {
      navigation.navigate('DoseDetails', {dose})
    } else {
      // Toggle selection
      list.setItemSelected(!selected, hooks)
    }
  }
  const onLongPress = () => list.onLongPress(selected, hooks)

  const category = getMainCategory(Substances[dose.substance]) ?? {}

  return (
    <Card
      style={{
        margin: 8,
        marginTop: 0,
        borderRadius: theme.roundness,
        backgroundColor: theme.colors.surface,
        overflow: 'hidden',
      }}
    >
      <TouchableRipple
        style={{
          borderRadius: theme.roundness,
          borderWidth: 2,
          borderColor: selected ? theme.colors.primary : 'transparent',
        }}
        onPress={onPress}
        onLongPress={onLongPress}
      >
      {note ? (
        <Row style={{padding: 16, justifyContent: 'space-between'}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 15, lineHeight: 20}}>
              {dose.notes}
            </Text>
          </View>
          {date.isValid() ?
            <Row style={{flexGrow: 0, alignItems: 'flex-start'}}>
              <Text style={{color: theme.colors.disabled}}>
                {
                  // Render with U+00A0 NO-BREAK SPACE to prevent break
                  date.fromNow().replace(/\s/g, '\u00A0')
                }
              </Text>
            </Row>
          : null}
        </Row>
      ) : (
        <View pointerEvents='none'>
        <List.Item
          title={dose.substanceName}
          description={dose.amount ? `${dose.amount} ${dose.unit??''}` : null}

          // Left: pill icon or checkbox
          left={() => selecting
            ? <View style={styles.left}>
                <Checkbox
                  status={selected ? 'checked' : 'unchecked'}
                  color={theme.colors.primary}
                />
              </View>
            : <IconButton style={styles.left} color={category.color} icon='pill' />
          }

          // Right: relative time
          right={() => date.isValid() ?
            <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{
                color: theme.colors.disabled,
                textAlign: 'right',
                marginEnd: 8,
              }}>
                {date.fromNow()}
              </Text>
            </View>
          : null}
        />
        </View>
      )}
      </TouchableRipple>
    </Card>
  )
}

const styles = StyleSheet.create({
  left: {
    margin: 8,
    marginLeft: 0,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})