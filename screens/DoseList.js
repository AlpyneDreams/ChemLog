import { useNavigation, useTheme } from '@react-navigation/native';
import React, { Component, useState } from 'react'
import { useEffect } from 'react';
import { View, StyleSheet, ToastAndroid, Vibration } from 'react-native'
import { FAB, IconButton, List, Snackbar, Menu, Portal, ActivityIndicator, Text } from 'react-native-paper';
import { Dose, DoseStorage } from '../store/Dose'
import { SettingsContext } from '../store/SettingsContext';
import Haptics from '../util/Haptics'
import { MORE_ICON } from '../util/Util';
import dayjs from 'dayjs'
import ConfirmDialog from '../components/ConfirmDialog';

function DoseEntry({dose, index, selecting, list}) {
  const theme = useTheme() 
  const navigation = useNavigation()
  const [selected, setSelected] = useState(false)

  const date = dayjs(dose.date)

  const hooks = {id: index, setSelected, delete: dose.delete.bind(dose)}

  return (
    <List.Item
      key={dose.id}
      title={dose.substanceName}
      description={dose.amount ? `${dose.amount} ${dose.unit??''}` : null}
      onPress={() => {
        if (!selecting) {
          navigation.navigate('DoseDetails', dose)
        } else {
          // Toggle selection
          list.setItemSelected(!selected, hooks)
        }
      }}
      onLongPress={() => list.onLongPress(selected, hooks)}
      left={() =>
        <List.Icon
          icon={
            selecting ? (selected ? 'checkbox-marked' : 'checkbox-blank-outline')
                      : 'pill'
          }
        />
      }
      right={() => date.isValid() ?
        <Text style={{
          color: theme.colors.disabled,
          marginTop: 16, marginRight: 8
        }}>{date.fromNow()}</Text>
      : null}
      style={{
        backgroundColor: theme.colors.surface,
        ...(index > 0 ? {
          borderTopColor: theme.colors.border,
          borderTopWidth: 1
        } : {})
      }}
    />
  )
}

function HomeContextMenu({select, selectAll}) {
  const [menu, setMenu] = useState(false)
  const {darkTheme, setDarkTheme} = React.useContext(SettingsContext)

  // Returns a function that performs fn(...args) and closes the menu
  const doAndClose = (fn, ...args) => ( function() { fn(...args); setMenu(false) } )

  return (
    <Menu 
      visible={menu}
      onDismiss={() => setMenu(false)}
      anchor={
        <IconButton icon={MORE_ICON} onPress={() => setMenu(true)} />
      }
    >
      <Menu.Item onPress={doAndClose(select)} title="Select" />
      {/*<Menu.Item onPress={doseAndClose(selectAll)} title="Select all" />*/}
      <Menu.Item
        title={`Switch to ${darkTheme ? 'light' : 'dark'} theme`}
        onPress={doAndClose(setDarkTheme, !darkTheme)}
      />
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
      title: `${size} dose${size===1?'':'s'} selected`
    })
  }

  deleteSelected() {

    let count = 0
    for (const [id, item] of this.state.selectedItems) {
      this.setItemSelected(false, item)
      item.delete()
      count++
    }

    console.log(`Deleted ${count} items.`)
    // TODO: Better way to pop this toast, and reflect if multiple doses were deleted.
    this.props.navigation.navigate('DoseList', -1)
    //this.forceUpdate()
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

  _isMounted = false

  componentDidMount() {

    this._isMounted = true

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

    navigation.setOptions({
      headerRight: () => !this.state.selecting
        ? <HomeContextMenu select={() => this.setSelecting(true)} />
        : <>
          <IconButton icon='delete' onPress={() => 
            this.state.selectedItems.size > 0 ?
              this.setState({confirmDelete: true}) : null
          }/>
        </>
      
    })
  }

  componentWillUnmount() {
    this.__isMounted = false
    this.unsubscribe()
  }

  render() {
    const {navigation, route} = this.props
    const {selecting, snackbar, confirmDelete} = this.state

    // Negative params means a dose was deleted
    const showSnackbar = (route.params < 0) && snackbar

    const setConfirmDelete = (value) => this.setState({confirmDelete: value}) 

    return (
      <View style={{height: '100%'}}>
        <List.Section>
          <List.Subheader>Recent Doses</List.Subheader>

          {DoseStorage.loaded
            ? DoseStorage.doses.map((dose, index) =>
              <DoseEntry key={dose.id} dose={dose} list={this} index={index} selecting={selecting} />
            )

            : <ActivityIndicator />
          }

        </List.Section>
        <FAB
          visible={!selecting}
          style={styles.fab}
          icon='plus'
          onPress={() => navigation.navigate('AddDose')}
        />
        <ConfirmDialog
          title={this.state.selectedItems.size === 1 ? 
            'Delete selected dose?' : 'Delete selected doses?'
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
        >Dose deleted.</Snackbar>
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