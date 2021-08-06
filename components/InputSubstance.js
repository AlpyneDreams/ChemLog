import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Menu, TextInput, Provider } from 'react-native-paper'
import { Row } from './Util'
import substances from '../data/tripsit.drugs.json'

export default function InputSubstance(props) {
  return (
    <TextInput
      label='Substance'
      {...props}
    />
    /*<Row style={{zIndex: 100}}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button mode='outlined' onPress={openMenu}>Show menu</Button>}
      >
        <Menu.Item title='Item 1'/>
        <Menu.Item title='Item 2'/>
        <Menu.Item title='Item 3'/>
      </Menu>
    </Row>*/
  )
}