import { useNavigation } from '@react-navigation/native';
import React, { Component, useState } from 'react'
import { useEffect } from 'react';
import { BackHandler, StyleSheet, ToastAndroid, Vibration } from 'react-native'
import { Button, Text, View } from "react-native";
import { FAB, IconButton, List, Snackbar, Menu, Portal } from 'react-native-paper';
import Dose from '../store/Dose'
import Haptics from '../util/Haptics'

function DoseEntry({dose, index, selecting, list}) {
  const navigation = useNavigation()
  const [selected, setSelected] = useState(false)

  return (
    <List.Item
      key={dose.id}
      title={dose.substance}
      description={dose.amount ? `${dose.amount} ${dose.unit??''}` : null}
      onPress={() => {
        if (!selecting) {
          navigation.navigate('DoseDetails', dose)
        } else {
          // Toggle selection
          list.setItemSelected(!selected, setSelected)
        }
      }}
      onLongPress={e => list.onLongPress(selected, setSelected)}
      left={() =>
        <List.Icon
          icon={
            selecting ? (selected ? 'checkbox-marked' : 'checkbox-blank-outline')
                      : 'pill'
          }
        />
      }
      style={{
        backgroundColor: 'white',
        ...(index > 0 ? {
          borderTopColor: '#e0e0e0',
          borderTopWidth: 1
        } : {})
      }}
    />
  )
}


export default class HomeScreen extends Component {
  state = {
    snackbar: true,
    selecting: false,
    selectedItems: new Set()
  }

  componentDidUpdate() {
    if (!this.state.snackbar)
      this.setState({snackbar: true})
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
        title: '0 doses selected'
      })
    } else {
      this.props.navigation.setOptions({headerLeft: undefined, title: undefined})
      for (const setSelected of this.state.selectedItems) {
        setSelected(false)
      }
      this.state.selectedItems.clear()
    }
  }

  /** Sets the selection state of an item */
  setItemSelected(selected, setSelected) {
    
    setSelected(selected)
    if (selected)
      this.state.selectedItems.add(setSelected)
    else
      this.state.selectedItems.delete(setSelected)

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

  onLongPress(selected, setSelected) {
    Haptics.longPress()

    // Enable selection if it's not enabled
    if (!this.state.selecting) {
      this.setSelecting(true)
    }

    // Toggle selection state
    this.setItemSelected(!selected, setSelected)
  }

  componentDidMount() {
    const navigation = this.props.navigation
    navigation.addListener('focus', () => {
      if (this.state.selecting) {
        this.setSelecting(false)
        return false
      } else {
        return true
      }
    })

  }

  render() {
    const {navigation, route} = this.props
    const {selecting, snackbar} = this.state

    return (
      <View style={{height: '100%'}}>
        <List.Section>
          <List.Subheader>Recent Doses</List.Subheader>

          {Dose.doses.map((dose, index) => {
            return (
              <DoseEntry dose={dose} list={this} index={index} selecting={selecting} />
            )
          })}

        </List.Section>
        <FAB
          style={styles.fab}
          icon='plus'
          onPress={() => navigation.navigate('AddDose')}
        />
        <Snackbar 
          visible={route.params < 0 && snackbar}
          duration={1000}
          onDismiss={() => this.setState({snackbar: false})}
        >Dose deleted.</Snackbar>
        {/*<Text>Open up App.js to start working on your app!</Text>
        <Button title="Go to details" onPress={() => navigation.navigate('Details')}/>*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    marginBottom: 48,
    right: 0,
    bottom: 0
  }
})