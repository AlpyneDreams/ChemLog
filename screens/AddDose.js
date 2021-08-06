import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from "react-native";
import { Title, Button, FAB, List, TextInput, IconButton } from 'react-native-paper';
import InputAmount from '../components/InputAmount';
import InputDate from '../components/InputDate';
import InputExpand from '../components/InputExpand';
import InputROA from '../components/InputROA';
import InputSubstance from '../components/InputSubstance';
import { Row } from '../components/Util'
import Dose from '../store/Dose';

export default class AddDose extends Component {
  state = {
    substance: 'THC',
    amount: '', //'30',
    unit: 'mg',
    roa: 'Oral',
    notes: 'Test dose.',
    date: '----',
  }

  componentDidMount() {
    this.navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => {
          let id = Dose.create(this.state).id
          this.navigation.navigate('Home', id)
        }}>Add</Button>
      )
    })
  }

  render() {
    this.navigation = this.props.navigation
    return (
      <View style={{padding: 12}}>
        {/*<Row style={{justifyContent: 'space-between'}}>
          <IconButton icon='close' onPress={navigation.goBack}/>
          <Button mode='contained'>Add</Button>
        </Row>*/}
        {/*<Title style={{marginBottom: 12}}>Add Dose</Title>*/}
        <InputSubstance value={this.state.substance} onChangeText={substance => this.setState({substance})} />
        <InputAmount
          amount={this.state.amount}
          onChangeAmount={amount => this.setState({amount})}
          unit={this.state.unit}
          onChangeUnit={unit => this.setState({unit})}
        />
        {/*<InputROA/>*/}
        <InputExpand title='Add notes' style={{marginTop: 12}}>
          <TextInput
            placeholder='Add notes'
            mode='contained'
            style={{flex: 1}}
          />
        </InputExpand>
        {/*<InputDate style={{marginTop: 12}} />*/}
        {/*<Text>Open up App.js to start working on your app!</Text>
        <Button title="Go to details" onPress={() => navigation.navigate('Details')}/>*/}
      </View>
    )  
  }
}