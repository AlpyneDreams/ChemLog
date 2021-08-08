import { useNavigation } from "@react-navigation/native"
import React from "react"
import { View, FlatList } from "react-native"
import { Text, List, ActivityIndicator } from "react-native-paper"
import Substances from '../data/tripsit.drugs.json'

// Add id property to substances
const substances = Object.entries(Substances).map( ([id, s]) => ({id, ...s}) )

export default function SubstanceList() {

  const navigation = useNavigation()
  const [endReached, setEndReached] = React.useState(false)

  return (
    <FlatList
      data={substances.slice()}
      //getItem={(data, index) => substances[index]}
      //getItemCount={(data) => substances.length}
      renderItem={({item: s}) => {
        return (
          <List.Item 
            key={s.id || s.name}
            title={s.pretty_name}
            left={() => <List.Icon icon='pill' />}
            onPress={() => navigation.navigate('Substance', {substance: s})}
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