import { setStatusBarStyle } from 'expo-status-bar'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Text, Title, useTheme } from 'react-native-paper'
import { Row } from '../components/Util'
import substances from '../data/tripsit.drugs.json'
import { categories as CATEGORIES } from '../data/Categories'
import CategoryChip from '../components/CategoryChip'
import SubstanceDose from '../components/substance/SubstanceDose'
import SubstanceEffects from '../components/substance/SubstanceEffects'
import SubstanceDuration from '../components/substance/SubstanceDuration'

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

      <SubstanceEffects substance={substance} />
      <SubstanceDose substance={substance} />
      <SubstanceDuration substance={substance} />
    </ScrollView>
  )
}
