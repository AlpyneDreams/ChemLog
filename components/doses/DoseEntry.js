import React, { Component, useState } from 'react'
import { View, Text as RText, StyleSheet, ToastAndroid, Vibration } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, List, Card, TouchableRipple, useTheme, Checkbox, IconButton, Divider } from 'react-native-paper'
import dayjs from 'dayjs'
import { Row } from '../Util'
import { LOCALE_COMPACT } from '../../util/dayjs'
import Substances from '../../store/Substances'
import { DAY_MS } from '../../util/Util'
import UserData from '../../store/UserData'

function NoteText({children}) {
  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 15, lineHeight: 20}}>
        {children}
      </Text>
    </View>
  )
}

export default function DoseEntry({dose, index, selecting, list, elevated}) {
  const theme = useTheme() 
  const navigation = useNavigation()
  const [selected, setSelected] = useState(false)

  const note = (dose.type === 'note')

  const date = dayjs(dose.date).locale(LOCALE_COMPACT)
  const isRecent = dayjs().diff(date) <= (DAY_MS * 2)
  const timestamp = isRecent ? date.fromNow() : date.format('H:mm')

  const hooks = {id: index, setSelected, delete: dose.delete.bind(dose), dose}

  React.useEffect(() => {
    if (!list) return
    list.state.selectableItems.add(hooks)
    return () => {
      list.state.selectableItems.delete(hooks)
    }
  }, [])

  const onPress = () => {
    if (!selecting) {
      navigation.push('DoseDetails', {dose})
    } else if (list) {
      // Toggle selection
      list.setItemSelected(!selected, hooks)
    }
  }
  const onLongPress = list ? () => list.onLongPress(selected, hooks) : null
  const {prefs: {compactDoseCards}} = UserData.useContext()

  const substance = Substances[dose.substance]

  return (
    <Card
      elevation={elevated ? 2 : 1}
      style={[
        {
          margin: 8,
          marginTop: 0,
          overflow: 'hidden',
          elevation: elevated ? 2 : 1
        },
        elevated
          ? null
          : (theme.dark ? {backgroundColor: theme.colors.surface} : null)
      ]}
      contentStyle = {{
        margin: 0,
      }}
    >
      <TouchableRipple
        style={{
          borderRadius: 3 * theme.roundness,
          borderWidth: 2,
          borderColor: selected ? theme.colors.primary : 'transparent',
        }}
        onPress={onPress}
        onLongPress={onLongPress}
      >
      {note ? (
        <Row style={{padding: 16, justifyContent: 'space-between'}}>
          <NoteText>
            {dose.notes}
          </NoteText>
          {date.isValid() ?
            <Row style={{flexGrow: 0, alignItems: 'flex-start'}}>
              <Text style={{color: theme.colors.disabled, marginLeft: 2}}>
                {
                  // Render with U+00A0 NO-BREAK SPACE to prevent break
                  timestamp.replace(/\s/g, '\u00A0')
                }
              </Text>
            </Row>
          : null}
        </Row>
      ) : ( // Dose
        <View pointerEvents='none'>
        <List.Item
          title={compactDoseCards && dose.amount
            ? <Text>{dose.substanceName} <Text style={{color: theme.colors.disabled}}>{dose.amount} {dose.unit??''}</Text></Text>
            : dose.substanceName}
          description={compactDoseCards
            ? (dose.notes ?? null)
            : (dose.amount ? `${dose.amount} ${dose.unit??''}` : null)
          }
          descriptionNumberOfLines={10}
          descriptionStyle={{color: theme.colors.outline}}

          // Left: substance icon or checkbox
          left={() => selecting
            ? <View style={styles.left}>
                <Checkbox
                  status={selected ? 'checked' : 'unchecked'}
                  color={theme.colors.primary}
                />
              </View>
            : <IconButton style={styles.left} iconColor={substance?.color} icon={substance?.icon} />
          }

          // Right: relative time
          right={() => date.isValid() ?
            <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{
                color: theme.colors.disabled,
                textAlign: 'right',
                marginRight: -8
              }}>
                {timestamp}
              </Text>
            </View>
          : null}
        />
        {!compactDoseCards && dose.notes ? <>
          <Divider/>
          <View style={{padding: 16}}>
            <NoteText>
              {dose.notes}
            </NoteText>
          </View>
        </> : null}
        </View>
      )}
      </TouchableRipple>
    </Card>
  )
}

const styles = StyleSheet.create({
  left: {
    margin: 0,
    marginStart: 8,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})