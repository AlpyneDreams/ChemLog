import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from "react-native";
import { Title, Button, FAB, List, TextInput, IconButton } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown'
import InputAmount from '../components/InputAmount';
import InputDate from '../components/InputDate';
import InputExpand from '../components/InputExpand';
import InputROA from '../components/InputROA';
import { Row } from '../components/Util'
import { Dose } from '../store/Dose';
import Substances from '../data/tripsit.drugs.json'

export default class AddDose extends Component {
  state = {
    substance: null,
    amount: '',
    unit: 'mg',
    roa: null,
    notes: '',
    date: null,

    _lastParams: null
  }

  componentDidMount() {

    const {edit, dose} = this.props.route.params ?? {}
    
    if (edit) {
      const substance = Substances[dose.substance]
      this.setState({
        ...dose,
        substance: {id: dose.substance, name: substance.pretty_name},
        date: new Date(dose.date)
      })
    }

    this.navigation.setOptions({
      headerRight: () => (
        <Button
          mode='contained'
          style={{marginEnd: 8, borderRadius: 20}}
          uppercase={false}
          disabled={!this.state.substance}
          onPress={() => {

            let data = Object.assign({}, this.state)

            data.substanceName = data.substance.name
            data.substance = data.substance.id
            data.date = (data.date ?? new Date()).getTime()

            delete data._lastParams
            
            if (!edit) {
              let dose = Dose.create(data)
              this.navigation.navigate({name: 'DoseList', params: {id: dose.id}})
            } else {
              let result = Dose.edit(dose.id, data)
              this.navigation.reset({
                index: 1,
                routes: [
                  {name: 'Home', params: {id: result.id, edited: true}},
                  {name: 'DoseDetails', params: {dose: result, edited: true}},
                ]
              })
            }

          }
        }>{!edit ? 'Add' : 'Edit'}</Button>
      )
    })

    // When focused, update state from params
    this.unsubscribe = this.navigation.addListener('focus', (e) => {
      const {params} = this.props.route
      if (params && params !== this.state._lastParams) {

        this.setState({_lastParams: params})

        // New substance picked
        if (params.substance)
          this.setState({substance: params?.substance})
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    this.navigation = this.props.navigation

    const {edit, dose: oldDose} = this.props.route.params ?? {}

    let {substance} = this.state

    return (
      <View style={{padding: 12}}>
        <DropDown 
          label='Substance'
          value={substance?.id}
          list={substance ? [{value: substance.id, label: substance.name}] : []}
          showDropDown={() => {
            this.navigation.navigate('SubstancePicker', {current: substance?.id, returnTo: !edit ? 'AddDose' : 'EditDose'})
          }}
        />
        <InputAmount
          amount={this.state.amount}
          onChangeAmount={amount => {
            if (!Number.isNaN(Number.parseFloat(amount)) || amount === '')
              this.setState({amount})
          }}
          unit={this.state.unit}
          onChangeUnit={unit => this.setState({unit})}
          startOpen={edit && oldDose.amount}
        />
        <InputROA value={this.state.roa} onChange={roa => this.setState({roa})} startOpen={edit && oldDose.roa} />
        <InputExpand title='Add notes' icon='note' style={{marginTop: 12}} startOpen={edit && oldDose.notes}>
          <TextInput
            placeholder='Add notes'
            mode='contained'
            multiline={true}
            style={{flex: 1}}
            value={this.state.notes}
            onChangeText={notes => this.setState({notes})}
          />
        </InputExpand>
        <InputDate 
          value={this.state.date}
          onChange={date => this.setState({date})}
        />
      </View>
    )  
  }
}