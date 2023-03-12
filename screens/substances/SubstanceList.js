import { useScrollToTop, useTheme, useRoute, useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View, FlatList, VirtualizedList, InteractionManager, ScrollView } from "react-native"
import { Text, List, ActivityIndicator, IconButton, Searchbar, Chip, Button } from "react-native-paper"
import Substances from '../../store/Substances'
import { categories, categories as CATEGORIES } from "../../store/Categories"
import CategoryChip from "../../components/substance/CategoryChip"
import { Row } from "../../components/Util"
import { useForcedUpdate } from "../../util/Util"
import UserData from '../../store/UserData'
import { SubstanceListItem, SwipeableSubstanceListItem } from '../../components/substance/SubstanceListItem'
import { SafeAreaView } from "react-native-safe-area-context"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import SearchRanking from "../../util/SearchRanking"
import { categoryRows } from "../../data/Categories"
import _ from "lodash"

// Add id property to substances
const substances = Object.entries(Substances).map( ([id, s]) => ({id, ...s}) )

// Pre-sort category rows
let catRows
{
  catRows = _.cloneDeep(categoryRows)

  const allCategories = Object.values(CATEGORIES)
    .filter(c => !c.unlisted)
    .map(c => c.name)
  
  // Build a set of categories not listed in catRows
  let cats = new Set(allCategories)
  for (let row of categoryRows) {
    for (let c of row)
      cats.delete(c)
  }
  cats = Array.from(cats)
  
  // Append remaining chips to rows, vertically
  while (cats.length > 0) {
    let col = cats.splice(0, catRows.length)
    for (let row of catRows)
      row.push(col.shift())
  }
  
}

function ListHeader({showCats, setShowCats, forceUpdate, search, loading}) {


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
      <List.Subheader>Categories</List.Subheader>
      <ScrollView horizontal={true} style={{marginTop: 8}} showsHorizontalScrollIndicator={false}>
        <View style={{marginLeft: 16}}>
          {catRows.map((r, i) => (
            <Row key={i}>
              {r.map(catChip)}
            </Row>
          ))}
        </View>
      </ScrollView>

      {!search ? <RecentSubstanceList categories={showCats} /> : null}
      <List.Subheader style={{marginTop: 8}}>{search ? 'Search Results' : 'All Substances'}</List.Subheader>
    </>
  )
}

function RecentSubstanceList({categories}) {
  const {recentSubstances} = UserData.useContext()

  if (recentSubstances.length === 0) return null

  let list = recentSubstances.map(id => Substances[id])

  if (categories.size > 0) {
    list = list.filter(s => filterCategories(s, categories))
  }

  if (list.length === 0)
    return null

  return (
    <List.Section>
      <List.Subheader>Recent Substances</List.Subheader>
      {list.map(item => 
        <SwipeableSubstanceListItem key={item.name} item={item} />
      )}
    </List.Section>
  )
}

function filterCategories(s, cats) {
  const categories = s.properties?.categories || s.categories
  return categories
    && categories.length > 0
    && categories.findIndex(c => cats.has(c)) !== -1
}

function getScore(name, query, queryLength, index, extra = 0) {
  if (index === 0) {
    if (name.length === queryLength) {
      // exact match
      return SearchRanking.EXACT_MATCH + extra
    } else {
      // match at start
      return SearchRanking.START_MATCH + extra
    }
  } else if (index !== -1) {
    // any other substring
    return index
  }
}

function performSearch(substances, query) {
  query = query.toLowerCase().trim()
  const queryLen = query.length

  const queue = []

  for (const s of substances) {
    const aliases = s.properties?.aliases || s.aliases

    let bestScore = null
    
    // Check substance name
    const idx = s.pretty_name.toLowerCase().indexOf(query)
    if (idx !== -1) {
      bestScore = getScore(s.pretty_name, query, queryLen, idx, SearchRanking.SCORE_BONUS_NAME)
    }
    
    // Aliases: find most relevant (unless we already have exact match)
    if (aliases && (!bestScore || bestScore > SearchRanking.EXACT_MATCH)) {
      for (let j = 0; j < aliases.length; j++) {

        const alias = aliases[j]
        const i = alias.indexOf(query)
        if (i !== -1) {
          let score = getScore(alias, query, queryLen, i, SearchRanking.SCORE_BONUS_ALIAS)

          // For fuzzier matches, fudge the numbers a bit to 
          // prioritize more common (usually lower index) aliases
          if (score >= 0) {
            score = j*10 + i
          }
          
          // Check if this is a better match
          if (!bestScore || bestScore > score) {
            bestScore = score
          }
        }
      }
    }

    if (bestScore) {
      queue.push([bestScore, s])
    }
  }

  return queue.sort((a, b) => a[0] - b[0])
}

const substanceEntries = substances.map((value, i) => [i, value])

export default function SubstanceList() {

  const theme = useTheme()
  const route = useRoute()
  const navigation = useNavigation()
  
  const {pickerMode, returnTo} = route?.params ?? {}

  const scrollRef = React.useRef(null)
  useScrollToTop(scrollRef)

  const [endReached, setEndReached] = React.useState(false)
  const [search, setSearchStr] = React.useState('')
  const forceUpdate = useForcedUpdate()

  const [showCats, setCats] = React.useState(new Set())

  const [loading, setLoading] = React.useState(false)
  const [list, setList] = React.useState(substanceEntries)

  function updateList(query, cats) {
    setLoading(true)

    // Interactions have 100ms to finish up before we interrupt them
    InteractionManager.setDeadline(100)
    InteractionManager.runAfterInteractions(() => {
      // Search cleared
      if (!query && cats.size === 0) {
        setList(substanceEntries)
        setLoading(false)
        return
      }

      // Filter by cateogires 
      const filtered = cats.size === 0 ? substances : substances.filter(s => filterCategories(s, cats))
      
      // Perform search
      setList(query ? performSearch(filtered, query) : filtered.map((value, i) => [i, value]))

      setLoading(false)
    })
  }

  const setSearch = (str) => {
    setSearchStr(str)
    updateList(str, showCats)
  }

  const setShowCats = (cats) => {
    setCats(cats)
    updateList(search, cats)
  }

  // TODO: Is it better to update FlatList.data or conditionally hide items in renderItem?
  
  // In pickerMode we have a top bar
  const Wrapper = pickerMode ? View : SafeAreaView

  const tabBarHeight = pickerMode ? 0 : useBottomTabBarHeight()

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
      value={search} onChangeText={setSearch}
    />
    <VirtualizedList
      style={{marginBottom: tabBarHeight + 16}}
      data={loading ? [] : list}
      getItem={(data, index) => data[index]}
      getItemCount={(data) => data.length}
      keyExtractor={(item, index) => item[1].name}
      ref={scrollRef}
      ListHeaderComponent={<ListHeader {...{showCats, setShowCats, forceUpdate, search: !!search, loading}} />}
      renderItem={({item, ...props}) => <SubstanceListItem item={item[1]} priority={item[0]} {...props} />}

      // Hide items that aren't rendered yet, so we can see the spinner
      removeClippedSubviews={true}
      ListFooterComponent={() =>
        <View style={{paddingVertical: 20, display: !loading && endReached ? 'none' : 'flex'}}>
          <ActivityIndicator animating={true} />
        </View>
      }
      onEndReached={() => setEndReached(true)}
    />
  </Wrapper>)

}