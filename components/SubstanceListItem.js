import { useNavigation, useRoute, useScrollToTop, useTheme } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View, FlatList, VirtualizedList } from "react-native"
import { List, IconButton } from "react-native-paper"
import { categories as CATEGORIES } from "../data/Categories"
import Haptics from '../util/Haptics'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from "react-native-gesture-handler"
import UserData from "../store/UserData"
import { LayoutAnimation } from "react-native"

export function SubstanceListItem({item: s, swipeable, ...props}) {

  const theme = useTheme()
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
      style={[
        {backgroundColor: theme.colors.background},
        swipeable ? {
          borderRadius: theme.roundness,
          marginRight: -4, marginLeft: -4 // hide rounded corenrs unless being swiped
        } : null,
        props.style
      ]}
    />
  )
}

const layoutAnim = { ...LayoutAnimation.Presets.easeInEaseOut, duration: 200}

export function SwipeableSubstanceListItem(props) {

  const theme = useTheme()
  const [removed, setRemoved] = React.useState(false)
  const {removeRecentSubstance} = UserData.useContext()

  const renderSideActions = (right, progress, dragX) => {

    const direction = right ? 'row' : 'row-reverse'
    return (
      <RectButton style={[styles.action, {flexDirection: direction}]}>
        <IconButton
          icon='delete-forever'
          size={30}
          color='#fff'
          style={[styles.actionIcon]}
        />
      </RectButton>
    )
  }

  return (
    <Swipeable
      renderLeftActions={(progress, dragX) => renderSideActions(false, progress, dragX)}
      renderRightActions={(progress, dragX) => renderSideActions(true, progress, dragX)}
      onSwipeableWillOpen={() => {
        removeRecentSubstance(props.item.name)
        LayoutAnimation.configureNext(layoutAnim)
        setRemoved(true)
      }}
    >
      <View style={{maxHeight: removed ? 0 : 'auto'}}>
        <SubstanceListItem swipeable={true} {...props} />
      </View>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#dd2c00',
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10
  },
});
