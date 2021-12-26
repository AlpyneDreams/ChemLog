import React, { Component, useState } from 'react'
import { useEffect } from 'react';
import { View, StyleSheet, ToastAndroid, Vibration, ScrollView } from 'react-native'
import { FAB, IconButton, List, Snackbar, Menu, Portal, ActivityIndicator } from 'react-native-paper';
import { Dose, DoseStorage } from '../store/Dose'
import { useNavigation } from '@react-navigation/native'
import Haptics from '../util/Haptics'
import { DAY_MS, MORE_ICON } from '../util/Util';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import DoseEntry from '../components/DoseEntry'
import MainFABGroup from '../components/MainFABGroup'
import dayjs from 'dayjs'
import { sortBy } from 'lodash';
import { CALENDAR_DATE_ONLY, CALENDAR_DATE_ONLY_MEDIUM } from '../util/dayjs';

function HomeContextMenu({select, selectAll}) {
  const navigation = useNavigation()
  const [menu, setMenu] = useState(false)

  // Returns a function that performs fn(...args) and closes the menu
  const doAndClose = (fn, ...args) => ( function() { fn(...args); setMenu(false) } )

  return (
    <Menu 
      visible={menu}
      onDismiss={() => setMenu(false)}
      style={{minWidth: 150}}
      anchor={
        <IconButton icon={MORE_ICON} onPress={() => setMenu(true)} />
      }
    >
      <Menu.Item title="Settings" onPress={doAndClose(() => navigation.navigate('Settings'))} />
      <Menu.Item onPress={doAndClose(select)} title="Select" />
      <Menu.Item onPress={doAndClose(selectAll)} title="Select all" />
    </Menu>
  )
}

export default class DoseList extends Component {
  state = {
    loaded: DoseStorage.loaded,
    lastParams: null,
    snackbar: true,
    selecting: false,
    selectedItems: new Map(),
    selectableItems: new Set(),
    confirmDelete: false
  }

  componentDidUpdate() {
    const {params} = this.props.route

    // Reset the snackbar, but only if params have changed.
    if (params !== this.state.lastParams) {
      this.setState({snackbar: true, lastParams: params})
    }
  }

  /** Sets if selection mode is enabled */
  setSelecting(selecting) {
    this.setState({selecting})
    if (selecting) {
      this.props.navigation.setOptions({
        headerLeft: () => (
          <IconButton
            icon='close'
            onPress={() => this.setSelecting(false)}
          />
        ),
        title: 'Select doses'
      })
    } else {
      this.props.navigation.setOptions({headerLeft: undefined, title: 'Doses'})
      for (const [id, {setSelected}] of this.state.selectedItems) {
        setSelected(false)
      }
      this.state.selectedItems.clear()
    }
  }

  selectAll() {
    this.setSelecting(true)
    for (const entry of this.state.selectableItems) {
      this.setItemSelected(true, entry)
    }
  }

  /** Sets the selection state of an item */
  setItemSelected(selected, item) {
    
    item.setSelected(selected)
    if (selected)
      this.state.selectedItems.set(item.id, item)
    else
      this.state.selectedItems.delete(item.id)

    let size = this.state.selectedItems.size

    // Nothing left selected? Leave selection mode
    if (size === 0) {
      this.setSelecting(false)
      return
    }
    
    // Update header text
    this.props.navigation.setOptions({
      title: `${size} ${size===1 ? 'entry' : 'entries'} selected`
    })
  }

  deleteSelected() {

    let count = 0
    for (const [id, item] of this.state.selectedItems) {
      this.setItemSelected(false, item)
      this.state.selectableItems.delete(item)
      item.delete()
      count++
    }

    console.log(`Deleted ${count} items.`)
    this.props.navigation.navigate('DoseList', {deleted: count})
  }

  onLongPress(selected, item) {
    Haptics.longPress()

    // Enable selection if it's not enabled
    if (!this.state.selecting) {
      this.setSelecting(true)
    }

    // Toggle selection state
    this.setItemSelected(!selected, item)
  }

  refreshInterval
  startRefreshTimeout
  _isMounted = false

  componentDidMount() {

    this._isMounted = true

    // Refresh every minute (for timestamps, see also: InputDate)
    this.startRefreshTimeout = setTimeout(() => {
      this.forceUpdate()
      this.refreshInterval = setInterval(() => {
        this.forceUpdate()
      }, 1000 * 60)
    }, 1000 * (60 - dayjs().second()))

    // Load doses
    if (!this.state.loaded) {
      DoseStorage.load().then(() => {
        // If we aren't mounted anymore, just ignore the warning.
        if (this._isMounted)
          this.setState({loaded: true})
      })
    }

    const navigation = this.props.navigation
    this.unsubscribe = navigation.addListener('focus', () => {
      if (this.state.selecting) {
        this.setSelecting(false)
        return false
      } else {
        return true
      }
    })

    // Update header based on if we're selecting
    this.setSelecting(this.state.selecting)

    navigation.setOptions({
      headerRight: () => !this.state.selecting
        ? <HomeContextMenu select={() => this.setSelecting(true)} selectAll={() => this.selectAll()} />
        : <>
          <IconButton icon='delete' onPress={() => 
            this.state.selectedItems.size > 0 ?
              this.setState({confirmDelete: true}) : null
          }/>
        </>
    })
  }

  componentWillUnmount() {
    this._isMounted = false
    if (this.unsubscribe)
      this.unsubscribe()
    clearTimeout(this.startRefreshTimeout)
    clearInterval(this.refreshInterval)
  }

  getDoses() {
    let doses = DoseStorage.items.slice()

    // Build a set of all calendar dates
    const dates = [...new Set(
      doses.map(d => dayjs(d.date).endOf('day').valueOf())
    )]

    // Add those dates as objects to the dose list
    doses.push(...(dates.map(date => ({type: 'date', date}))))

    // Sort by newest first
    return sortBy(doses, d => -d.date)
  }

  render() {
    const {navigation, route} = this.props
    const {selecting, snackbar, confirmDelete} = this.state

    const showSnackbar = (route.params?.deleted) && snackbar

    const setConfirmDelete = (value) => this.setState({confirmDelete: value})

    const doses = this.state.loaded ? this.getDoses() : []

    return (
      <View style={{height: '100%'}}>
        <ScrollView>
          <List.Section style={{paddingBottom: 64}}>
            {this.state.loaded ? doses.map((dose, index) => 
                dose.type === 'date' ?
                  <List.Subheader key={dose.date}>{dayjs(dose.date).calendar(null, CALENDAR_DATE_ONLY_MEDIUM)}</List.Subheader>
                :
                  <DoseEntry key={dose.id} dose={dose} list={this} index={index} selecting={selecting} />
              )
              : <ActivityIndicator />
            }

          </List.Section>
        </ScrollView>
        <MainFABGroup
          visible={!selecting}
          addDose={() => navigation.navigate('AddDose')}
          addNote={() => navigation.navigate('AddNote')}
        />
        <ConfirmDialog
          title={
            this.state.selectedItems.size === 1 ? 
              'Delete selected entries?' : 'Delete selected entries?'
          }
          acceptLabel='Delete'
          state={[confirmDelete, setConfirmDelete]}
          onAccept={() => this.deleteSelected()}
        />
        <Snackbar 
          visible={showSnackbar}
          duration={1000}
          onDismiss={() => this.setState({snackbar: false})}
          style={{marginBottom: 96}}
        >{route.params?.deleted === 1 ? 'Entry deleted.' : `Deleted ${route.params?.deleted} entries.`}</Snackbar>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    marginBottom: 24,
    right: 0,
    bottom: 0
  }
})