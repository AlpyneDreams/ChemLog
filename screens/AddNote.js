import React, { Component } from 'react'
import { View } from "react-native"
import { Button, TextInput } from 'react-native-paper'
import InputDate from '../components/InputDate'
import { Dose } from '../store/Dose'

export default class AddNote extends Component {
  state = {
    type: 'note',
    notes: '',
    date: null,
  }

  textInput = React.createRef()

  componentDidMount() {
    const {edit, note} = this.props.route.params ?? {}
    
    if (edit) {
      this.setState({...note, date: new Date(note.date)})
    }
  }

  componentDidUpdate() {
    const {edit, note} = this.props.route.params ?? {}

    this.navigation.setOptions({
      headerRight: () => {
        return (
          <Button
            mode='contained'
            style={{marginEnd: 8, borderRadius: 20}}
            uppercase={false}
            disabled={!this.state.notes}
            onPress={() => {

              let data = Object.assign({}, this.state)

              data.date = (data.date ?? new Date()).getTime()
              
              if (!edit) {
                let note = Dose.create(data)
                this.navigation.navigate({name: 'DoseList', params: {id: note.id}})
              } else {
                let result = Dose.edit(note.id, data)
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
      }
    })
  }

  render() {
    this.navigation = this.props.navigation

    return (
      <View style={{padding: 12}}>
        <TextInput
          placeholder='Add note'
          autoFocus={true}
          ref={this.textInput}
          onLayout={(e) => {this.textInput.current.focus()}}
          mode='outlined'
          multiline={true}
          numberOfLines={4}
          value={this.state.notes}
          onChangeText={notes => this.setState({notes})}
        />
        <InputDate 
          value={this.state.date}
          onChange={date => this.setState({date})}
        />
      </View>
    )  
  }
}