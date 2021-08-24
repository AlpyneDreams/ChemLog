import { useNavigation, useRoute, useScrollToTop, useTheme } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View, FlatList, VirtualizedList } from "react-native"
import { List, IconButton } from "react-native-paper"
import { categories as CATEGORIES } from "../data/Categories"
import Haptics from '../util/Haptics'

export default function SubstanceListItem({item: s, ...props}) {

  const navigation = useNavigation()
  const params = useRoute().params ?? {}
  const {pickerMode, returnTo} = params

  const key = s.id || s.name
  const aliases = s.properties?.aliases ?? s.aliases

  const onPress = pickerMode
    ? () => navigation.navigate({name: returnTo, params: {substance: {name: s.pretty_name, id: key}}, merge: true})
    : () => navigation.navigate('Substance', {substance: s})
  
  let color
  let categories = s.categories ?? s.properties?.categories
  
  // Pick primary category's color based on category priority
  if (categories) {
    let primary = categories
    .map(c => CATEGORIES[c] ?? {})
    .reduce((a, b) => {
      const ai = a.priority,
            bi = b.priority
      return (ai < bi) ? a : b
    })

    color = primary.color
  }

  return (
    <List.Item 
      key={key}
      title={s.pretty_name}
      description={aliases ? aliases.join(', ') : null}
      left={() => <List.Icon icon='pill' color={color} />}
      onPress={onPress}
      onLongPress={pickerMode ? () => {
        Haptics.longPress()
        navigation.navigate('Substance', {substance: s, pickerMode: true, returnTo})
      } : null}
      right={props =>  pickerMode && key === params.current ? 
        <IconButton icon='check'/>
      : null}
    />
  )
}
