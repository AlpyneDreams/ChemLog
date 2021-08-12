import { useNavigation, useRoute, useScrollToTop, useTheme } from "@react-navigation/native"
import React from "react"
import { View, FlatList, VirtualizedList } from "react-native"
import { Text, List, ActivityIndicator, IconButton, Searchbar } from "react-native-paper"
import Substances from '../data/tripsit.drugs.json'
import { categoryOrder as CATEGORY_ORDER, categories as CATEGORIES } from "../data/Categories"
import Haptics from "../util/Haptics"
import CategoryChip from "../components/CategoryChip"
import { Row } from "../components/Util"
import { useForcedUpdate } from "../util/Util"

// Add id property to substances
const substances = Object.entries(Substances).map( ([id, s]) => ({id, ...s}) )

export default function SubstanceList() {

  const scrollRef = React.useRef(null)
  useScrollToTop(scrollRef)

  const params = useRoute().params ?? {}
  const {pickerMode, returnTo} = params

  const navigation = useNavigation()
  const [endReached, setEndReached] = React.useState(false)
  const [query, setQuery] = React.useState(null)
  const forceUpdate = useForcedUpdate()

  const [showCats, setShowCats] = React.useState(new Set())

  // TODO: Better matching, including aliases, maybe s.name
  const queryMatches = (s) => (
    (!query || s.pretty_name.toLowerCase().includes(query))
    && (showCats.size === 0 || 
      (s.properties?.categories || s.categories || []).findIndex(c => showCats.has(c)) !== -1
    )
  )

  const list = substances.slice().filter(queryMatches)    

  // TODO: Sort substances by relevance to query
  // (i.e. indexOf: "phen" -> "Phenibut" before "Ephenidine"; prefer exact match, etc)
  // and other things factors for relevance

  // TODO: Is it better to update FlatList.data or conditionally hide items in renderItem?
  
  return (<>
    <Searchbar
      style={{
        marginTop: 8,
        marginHorizontal: 8,
        borderRadius: 30
      }}
      placeholder='Search'
      value={query} onChangeText={setQuery}
    />
    <VirtualizedList
      data={list}
      getItem={(data, index) => data[index]}
      getItemCount={(data) => data.length}
      keyExtractor={(item, index) => item.name}
      ref={scrollRef}
      ListHeaderComponent={
        <Row style={{marginTop: 8, marginLeft: 16, flexWrap: 'wrap'}}>
          {Object.entries(CATEGORIES).map( ([name, category]) => 
            <CategoryChip 
              key={name}
              category={name}
              selectable={true}
              onChange={(cat, state) => {
                if (state)
                  showCats.add(cat)
                else
                  showCats.delete(cat)
                setShowCats(new Set(showCats))
                forceUpdate()
              }}/>
          )}
        </Row>
      }
      renderItem={({item: s, ...props}) => {
        const key = s.id || s.name
        const aliases = s.properties?.aliases ?? s.aliases

        const onPress = pickerMode
          ? () => navigation.navigate({name: returnTo, params: {substance: {name: s.pretty_name, id: key}}, merge: true})
          : () => navigation.navigate('Substance', {substance: s})
        
        let color
        let categories = s.categories ?? s.properties?.categories
        
        if (categories) {
          let primary = categories.reduce((a, b) => {
            const ai = CATEGORY_ORDER.indexOf(a),
                  bi = CATEGORY_ORDER.indexOf(b)
            return (ai < bi || bi < 0) ? a : b
          })
          color = CATEGORIES[primary]?.color
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
              // TODO: Update substance page to add 'Select' button when pickerMode is true
              navigation.navigate('Substance', {substance: s, pickerMode: true, returnTo})
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
  </>)

}