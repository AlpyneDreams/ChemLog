import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from "react-native";
import { Title, Button, FAB, List, TextInput, IconButton, withTheme } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown'
import InputAmount from '../../components/inputs/InputAmount';
import InputDate from '../../components/inputs/InputDate';
import InputExpand from '../../components/inputs/InputExpand';
import InputROA from '../../components/inputs/InputROA';
import { Row } from '../../components/Util'
import { Dose } from '../../store/Dose';
import Substances from '../../store/Substances'
import UserData from '../../store/UserData';
import GenericInput from '../../components/inputs/GenericInput';
import InputSubstance from '../../components/inputs/InputSubstance';

export class AddDose extends Component {
  static contextType = UserData.Context

  state = {
    substance: null,
    amount: '',
    unit: 'mg',
    roa: null,
    notes: '',
    date: null,
  }
  
  textInput = React.createRef()

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
          onPress={() => this.submit(edit, dose)}
        >{!edit ? 'Add' : 'Save'}</Button>
      )
    })

    // For new doses, go straight to substance picker
    if (!edit && !this.state.substance && !this.props.route.params?.substance) {
      this.navigation.navigate('SubstancePicker', {
        current: null, returnTo: 'AddDose', skipButton: true
      })
    }
  }

  submit(edit, dose) {
    let data = Object.assign({}, this.state)

    // data.substance is an {id, name} pair, not full object
    data.substanceName = data.substance.name
    data.substance = data.substance.id
    data.date = (data.date ?? new Date()).getTime()
    
    if (!edit) {
      let dose = Dose.create(data)

      this.context.addRecentSubstance(dose.substance)

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

  render() {
    this.navigation = this.props.navigation
    const theme = this.props.theme
    const {edit, dose: oldDose, focus} = this.props.route.params ?? {}

    let {substance} = this.state

    substance = substance ? Substances[substance.id] : substance


    const focusNotes = (focus === 'notes')
    const noteOpen = (edit && oldDose.notes) || focusNotes

    return (
      <View style={{padding: 12, height: '100%'}}>
        <InputSubstance
          value={substance}
          onChange={substance => this.setState({substance})}
          returnTo={!edit ? 'AddDose' : 'EditDose'}
        />
        <InputAmount
          amount={this.state.amount}
          onChangeAmount={amount => this.setState({amount})}
          unit={this.state.unit}
          onChangeUnit={unit => this.setState({unit})}
          startOpen={edit && oldDose.amount}
        />
        <InputROA value={this.state.roa} onChange={roa => this.setState({roa})} startOpen={edit && oldDose.roa} />
        <InputExpand title='Add notes' icon='note' style={{marginTop: 12}} startOpen={noteOpen}>
          <TextInput
            placeholder='Add notes'
            autoFocus={focusNotes}
            ref={this.textInput}
            onLayout={(e) => {focusNotes && this.textInput.current.focus()}}
            mode='outlined'
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
        <FAB
          icon={edit ? 'pencil' : 'plus'}
          uppercase={false}
          label={edit ? 'Save' : 'Add'}
          disabled={!this.state.substance}
          style={[{
            position: 'absolute', bottom: 8, right: 0,
            margin: 16,
          }, !this.state.substance ? null : {backgroundColor: theme.colors.primary} ]}
          onPress={() => this.submit(edit, oldDose)}
        />
      </View>
    )  
  }
}

export default withTheme(AddDose)