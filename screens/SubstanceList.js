import { useNavigation, useRoute, useScrollToTop, useTheme } from "@react-navigation/native"
import React from "react"
import { View, FlatList, VirtualizedList } from "react-native"
import { Text, List, ActivityIndicator, IconButton, Searchbar, Chip } from "react-native-paper"
import Substances from '../data/tripsit.drugs.json'
import { categories as CATEGORIES } from "../data/Categories"
import Haptics from "../util/Haptics"
import CategoryChip from "../components/CategoryChip"
import { Row } from "../components/Util"
import { useForcedUpdate } from "../util/Util"

// Add id property to substances
const substances = Object.entries(Substances).map( ([id, s]) => ({id, ...s}) )

const mainCategories = Object.values(CATEGORIES)
  .filter(c => c.order !== Number.MAX_SAFE_INTEGER)
  .sort((c1, c2) => c1.order - c2.order)

const extraCategories = Object.values(CATEGORIES)
  .filter(c => c.order === Number.MAX_SAFE_INTEGER)


function ListHeader({showCats, setShowCats, forceUpdate}) {

  const [catsExpanded, setCatsExpanded] = React.useState(false)

  const catChip = (name) => (
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
  )  

  return (
    <>
      <Row style={{marginTop: 8, marginLeft: 16, flexWrap: 'wrap'}}>
        {mainCategories.map(category => 
          catChip(category.name)
        )}
        <Chip
          onPress={() => setCatsExpanded(!catsExpanded)}
          mode='outlined'
          style={{margin: 4, backgroundColor: 'transparent'}}
        >
          {!catsExpanded ? 'More...' : 'Less...'}
        </Chip>
        {catsExpanded ? (
          <Row style={{flexWrap: 'wrap'}}>
            {extraCategories.map(category =>
              catChip(category.name)
            )}
          </Row>
        ) : null}
      </Row>
    </>
  )
}

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
      ListHeaderComponent={<ListHeader {...{showCats, setShowCats, forceUpdate}} />}
      renderItem={({item: s, ...props}) => {
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