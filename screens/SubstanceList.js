import { useNavigation, useRoute, useTheme } from "@react-navigation/native"
import React from "react"
import { View, FlatList } from "react-native"
import { Text, List, ActivityIndicator, IconButton } from "react-native-paper"
import Substances from '../data/tripsit.drugs.json'
import Haptics from "../util/Haptics"

// Add id property to substances
const substances = Object.entries(Substances).map( ([id, s]) => ({id, ...s}) )

export default function SubstanceList() {

  const params = useRoute().params ?? {}
  const {pickerMode} = params

  const navigation = useNavigation()
  const [endReached, setEndReached] = React.useState(false)

  return (
    <FlatList
      data={substances.slice()}
      //getItem={(data, index) => substances[index]}
      //getItemCount={(data) => substances.length}
      renderItem={({item: s}) => {

        const key = s.id || s.name
        const aliases = s.properties?.aliases ?? s.aliases

        const onPress = pickerMode
          ? () => navigation.navigate('AddDose', {substance: {name: s.pretty_name, id: key}, merge: true})
          : () => navigation.navigate('Substance', {substance: s})

        return (
          <List.Item 
            key={key}
            title={s.pretty_name}
            description={aliases ? aliases.join(', ') : null}
            left={() => <List.Icon icon='pill' />}
            onPress={onPress}
            onLongPress={pickerMode ? () => {
              Haptics.longPress()
              // TODO: Update substance page to add 'Select' button when pickerMode is true
              navigation.navigate('Substance', {substance: s, pickerMode: true})
            } : null}
            right={props =>  pickerMode && key === params.current ? 
              <IconButton icon='check'/>
            : null}
          />
        )
      }}
      ListFooterComponent={() =>
        <View style={{paddingVertical: 20, display: endReached ? 'none' : 'flex'}}>
          <ActivityIndicator animating={true} />
        </View>
      }
      onEndReached={() => setEndReached(true)}
    />
  )

}