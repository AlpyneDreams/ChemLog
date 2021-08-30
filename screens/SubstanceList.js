import { useScrollToTop, useTheme, useRoute } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View, FlatList, VirtualizedList } from "react-native"
import { Text, List, ActivityIndicator, IconButton, Searchbar, Chip } from "react-native-paper"
import Substances from '../data/tripsit.drugs.json'
import { categories as CATEGORIES } from "../data/Categories"
import CategoryChip from "../components/CategoryChip"
import { Row } from "../components/Util"
import { useForcedUpdate } from "../util/Util"
import UserData from '../store/UserData'
import { SubstanceListItem, SwipeableSubstanceListItem } from '../components/SubstanceListItem'
import { SafeAreaView } from "react-native-safe-area-context"

// Add id property to substances
const substances = Object.entries(Substances).map( ([id, s]) => ({id, ...s}) )

const mainCategories = Object.values(CATEGORIES)
  .filter(c => c.order !== Number.MAX_SAFE_INTEGER)
  .sort((c1, c2) => c1.order - c2.order)

const extraCategories = Object.values(CATEGORIES)
  .filter(c => c.order === Number.MAX_SAFE_INTEGER)


function ListHeader({showCats, setShowCats, forceUpdate, search}) {

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
          <Row style={{flexWrap: 'wrap', maxWidth: '100%'}}>
            {extraCategories.map(category =>
              catChip(category.name)
            )}
          </Row>
        ) : null}
      </Row>
      {!search ? <RecentSubstanceList /> : null}
      <List.Subheader style={{marginTop: 8}}>All Substances</List.Subheader>
    </>
  )
}

function RecentSubstanceList() {
  const {recentSubstances} = UserData.useContext()

  if (recentSubstances.length === 0) return null

  let list = recentSubstances.map(id => Substances[id])

  return (
    <List.Section>
      <List.Subheader>Recent Substances</List.Subheader>
      {list.map(item => 
        <SwipeableSubstanceListItem key={item.name} item={item} />
      )}
    </List.Section>
  )
}

export default function SubstanceList() {

  const theme = useTheme()

  const scrollRef = React.useRef(null)
  useScrollToTop(scrollRef)

  const [endReached, setEndReached] = React.useState(false)
  const [query, setQuery] = React.useState('')
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
  
  // In pickerMode we have a top bar
  const pickerMode = useRoute()?.params?.pickerMode
  const Wrapper = pickerMode ? View : SafeAreaView 

  return (<Wrapper>
    <Searchbar
      style={{
        marginTop: 8,
        marginHorizontal: 8,
        borderRadius: 30,
        // on dark: blend in; on light: stand out
        backgroundColor: theme.dark ? theme.colors.background : theme.colors.surface,
        marginBottom: theme.dark ? 8 : 0,
        elevation: theme.dark ? 0 : 2
      }}
      placeholder='Search substances'
      value={query} onChangeText={setQuery}
    />
    <VirtualizedList
      data={list}
      getItem={(data, index) => data[index]}
      getItemCount={(data) => data.length}
      keyExtractor={(item, index) => item.name}
      ref={scrollRef}
      ListHeaderComponent={<ListHeader {...{showCats, setShowCats, forceUpdate, search: !!query}} />}
      renderItem={(props) => <SubstanceListItem {...props} />}
      ListFooterComponent={() =>
        <View style={{paddingVertical: 20, display: endReached ? 'none' : 'flex'}}>
          <ActivityIndicator animating={true} />
        </View>
      }
      onEndReached={() => setEndReached(true)}
    />
  </Wrapper>)

}