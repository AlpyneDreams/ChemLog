import React, { Component } from 'react'
import { View } from "react-native"
import { Button, FAB, TextInput, withTheme } from 'react-native-paper'
import InputDate from '../../components/inputs/InputDate'
import { Dose } from '../../store/Dose'

class AddNote extends Component {
  state = {
    type: 'note',
    notes: '',
    date: null,
  }

  textInput = React.createRef()

  componentDidMount() {
    const {edit, note} = this.props.route.params ?? {}
    
    if (note) {
      this.setState({...note, date: note.date ? new Date(note.date) : null})
    } else {
      this.forceUpdate()
    }
  }

  componentDidUpdate() {
    const {edit, note} = this.props.route.params ?? {}

    this.navigation.setOptions({
      title: (!edit ? (note ? 'Copy' : 'Add') : 'Edit') + ' Note',
      headerRight: () => {
        return (
          <Button
            mode='contained'
            style={{marginEnd: 8, borderRadius: 20}}
            uppercase={false}
            disabled={!this.state.notes}
            onPress={() => this.submit(edit, note)}
          >
            {!edit ? 'Add' : 'Save'}
          </Button>
        )
      }
    })
  }

  submit(edit, note) {
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

  render() {
    this.navigation = this.props.navigation
    const theme = this.props.theme
    const {edit, note} = this.props.route.params ?? {}

    return (
      <View style={{padding: 12, height: '100%'}}>
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
        <FAB
          icon={edit ? 'pencil' : 'plus'}
          uppercase={false}
          label={edit ? 'Save' : 'Add'}
          disabled={!this.state.notes}
          style={[{
            position: 'absolute', bottom: 8, right: 0,
            margin: 16,
          }, !this.state.notes ? null : {backgroundColor: theme.colors.primary} ]}
          onPress={() => this.submit(edit, note)}
        />
      </View>
    )  
  }
}

export default withTheme(AddNote)