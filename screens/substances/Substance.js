import { setStatusBarStyle } from 'expo-status-bar'
import React from 'react'
import { ScrollView, View, Linking } from 'react-native'
import { Button, Text, Title, useTheme } from 'react-native-paper'
import { Row } from '../../components/Util'
import substances from '../../data/Substances'
import { categories as CATEGORIES } from '../../data/Categories'
import CategoryChip from '../../components/substance/CategoryChip'
import SubstanceDose from '../../components/substance/SubstanceDose'
import SubstanceEffects from '../../components/substance/SubstanceEffects'
import SubstanceDuration from '../../components/substance/SubstanceDuration'
import SubstanceMisc from '../../components/substance/SubstanceMisc'
import SubstanceInteractions from '../../components/substance/SubstanceInteractions'
import { HeaderTitle } from '@react-navigation/elements'
import { Icon } from '../../components/Icon'

export default function SubstanceScreen({navigation, route}) {

  const theme = useTheme()
  let {substance, pickerMode, returnTo} = route.params || {substance: {properties: {}}}
  let id

  if (typeof substance === 'string') {
    id = substance
    substance = substances[id]
  } else {
    id = substance?.name
  }
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: substance?.pretty_name || 'Substance',
      headerTitle: (props) => <Row>
        <Icon icon={substance.icon} size={20} color={substance.color} style={{marginTop: 4, marginRight: 4}} />
        <HeaderTitle {...props} />
      </Row>,
      headerRight: () => 
        <Button
          uppercase={false}
          style={pickerMode ? {marginEnd: 8, borderRadius: 20} : {}}
          disabled={!substance}
          onPress={() => {
            navigation.navigate({
              name: pickerMode ? returnTo : 'AddDose', 
              params: {
                substance:{name: substance?.pretty_name, id: id},
              },
              merge: true
            })
          }}
        >{pickerMode ? 'Select' : 'New Dose'}</Button>
    })
    
    // In light theme, we need to invert the status bar
    // for TransitionPresets.ModalPresentationIOS
    if (!theme.dark) {
      setTimeout(() => {setStatusBarStyle('light')}, 100)

      return navigation.addListener('transitionStart', (e) => {
        if (e.data.closing)
          setStatusBarStyle('dark')
      })
    }

  }, [navigation, route])

  if (!substance)
    return <Title style={{paddingHorizontal: 20}}>Error: Unknown substance '{id}'</Title>

  let aliases = substance.properties?.aliases ?? substance.aliases
  let categories = substance.properties?.categories ?? substance.categories

  categories = categories.map(c => CATEGORIES[c] ?? {}).sort((a, b) => a.priority - b.priority)

  return (
    <ScrollView style={{paddingHorizontal: 20}}>

      {aliases ? 
        <Text style={{
          fontSize: 14, color: theme.colors.placeholder
        }}>{aliases.join(', ')}</Text>
      : null}

      {categories ?
        <Row style={{marginTop: 8, flexWrap: 'wrap'}}>
          {categories.map(c => <CategoryChip key={c.name} category={c.name} />)}
        </Row>
      : null}

      <View style={{paddingVertical: 15}}>
        <Text>{substance.properties.summary}</Text>
      </View>

      <SubstanceMisc substance={substance} details={false} />

      <Row style={{justifyContent: 'space-evenly', flexGrow: 1}}>
        <Button
          uppercase={false}
          icon='link'
          onPress={() => Linking.openURL(`https://drugs.tripsit.me/${id}`)}
        >
          TripSit
        </Button>
        <Button
          uppercase={false}
          icon='magnify'
          onPress={() => Linking.openURL(`https://psychonautwiki.org/w/index.php?search=${id}`)}
        >
          PsychonautWiki
        </Button>
      </Row>
      

      <SubstanceEffects substance={substance} />
      <SubstanceDose substance={substance} />
      <SubstanceDuration substance={substance} />

      <SubstanceMisc substance={substance} details={true} />

      <SubstanceInteractions substance={substance} />
      <View style={{height: 20}} />
    </ScrollView>
  )
}