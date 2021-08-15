import React, { Component, useState } from 'react'
import { View, Text as RText, StyleSheet, ToastAndroid, Vibration } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, List, Card, TouchableRipple, useTheme, Checkbox, IconButton } from 'react-native-paper'
import dayjs from 'dayjs'
import { Row } from './Util'
import { LOCALE_COMPACT } from '../util/dayjs'

export default function DoseEntry({dose, index, selecting, list}) {
  const theme = useTheme() 
  const navigation = useNavigation()
  const [selected, setSelected] = useState(false)

  const date = dayjs(dose.date)
  const date = dayjs(dose.date).locale(LOCALE_COMPACT)

  const hooks = {id: index, setSelected, delete: dose.delete.bind(dose)}

  const onPress = () => {
    if (!selecting) {
      navigation.navigate('DoseDetails', {dose})
    } else {
      // Toggle selection
      list.setItemSelected(!selected, hooks)
    }
  }
  const onLongPress = () => list.onLongPress(selected, hooks)

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
        <List.Item
          title={dose.substanceName}
          description={dose.amount ? `${dose.amount} ${dose.unit??''}` : null}
          left={() => selecting
            ? <View style={styles.left}>
                <Checkbox
                  status={selected ? 'checked' : 'unchecked'}
                  color={theme.colors.primary}
                />
              </View>
            : <IconButton style={styles.left} icon='pill' />
          }
          right={() => date.isValid() ?
            <Text style={{
              color: theme.colors.disabled,
              marginTop: 17, marginRight: 8
            }}>
              {date.fromNow()}
            </Text>
          : null}
        />
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