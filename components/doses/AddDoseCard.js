import { useState } from "react"
import { View, LayoutAnimation } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Button, Card, IconButton, TextInput, useTheme } from "react-native-paper"

import { Dose } from "../../store/Dose"
import Substances from "../../store/Substances"
import { LayoutAnims } from "../../util/Util"
import InputAmount from "../inputs/InputAmount"
import InputDate from "../inputs/InputDate"
import InputROA from "../inputs/InputROA"
import InputSubstance from "../inputs/InputSubstance"
import { TabBar } from "../Tabs"
import { Row } from "../Util"
import UserData from "../../store/UserData"

export default function AddDoseCard({onSubmit=() => {}}) {
  const [date, setDate] = useState(null)
  const [tab, setTab]   = useState(1)

  // TODO: icons={['beaker-outline', 'note']} looks weird but we should maybe have icons
  return (
    <Card style={{margin: 8}}>
      <TabBar names={['Dose', 'Note']} tab={tab} setTab={setTab}/>
      {!tab ? <AddDoseForm onSubmit={onSubmit} /> : <AddNoteForm onSubmit={onSubmit} />}
    </Card>
 )
}

const ToggleIcon = ({icon='clock', iconOff=icon+'-outline', value=true, onChange=() => {}}) => 
  <IconButton
    icon={value ? icon : iconOff}
    onPress={() => {
      LayoutAnimation.configureNext(LayoutAnims.ease)
      onChange(!value)
    }}
    containerColor ={value ? useTheme().colors.secondaryContainer : null}
    style={{borderWidth: 0}}
  />

const ToggleView = ({visible=true, children, style}) =>
  visible && <View>
    {children}
  </View>

function InputNotes({visible=true, note, setNote}) {
  const theme = useTheme()
  return (
    <ToggleView visible={visible} style={{marginHorizontal: 8}}>
      <TextInput
        placeholder='Add note'
        autoFocus={false}
        ref={this.textInput}
        mode='outlined'
        numberOfLines={3}
        multiline={true}
        style={{backgroundColor: 'transparent'}}
        outlineStyle={{borderWidth: 0}}
        underlineColor={theme.colors.outline}
        value={note}
        onChangeText={setNote}
      />
    </ToggleView>
  )
}

const InputDateTime = ({visible=true, date, setDate}) =>
  <ToggleView visible={visible} style={{marginBottom: 8}}>
    <InputDate
      style={{backgroundColor: 'transparent'}}
      value={date}
      onChange={setDate}
    />
  </ToggleView>

function AddDoseForm({onSubmit=() => {}}) {
  const theme                       = useTheme()
  const navigation                  = useNavigation()
  const userData                    = UserData.useContext()

  let   [substance, setSubstance]   = useState(null)
  const [date,      setDate]        = useState(null)
  const [amount,    setAmount]      = useState(null)
  const [unit,      setUnit]        = useState('mg')
  const [roa,       setRoa]         = useState(null)
  const [notes,     setNotes]       = useState('')

  const [showDate,    setShowDate]   = useState(false)
  const [showAmount,  setShowAmount] = useState(false)
  const [showRoa,     setShowRoa]    = useState(false)
  const [showNotes,   setShowNotes]  = useState(false)

  substance = (substance && substance.id)
            ? Substances[substance.id]
            : substance

  function submit() {
    let edit = false
    let data = {
      substanceName: substance.pretty_name,
      substance: substance.name,
      date: (date ?? new Date()).getTime(),
      amount, unit, roa, notes
    }

    if (!edit) {
      let dose = Dose.create(data)
      userData.addRecentSubstance(dose.substance)
    } else {
      Dose.edit(dose.id, data)
    }
    onSubmit()
    setSubstance(null)
    setDate(null)
    setAmount(null)
    setUnit('mg')
    setRoa(null)
    setNotes('')
    setShowDate(false)
    setShowAmount(false)
    setShowRoa(false)
    setShowNotes(false)
  }

  function onChangeSubstance(substance) {
    setSubstance(substance)
    setShowRoa(!!substance || roa)
  }

  function onChangeRoa(roa) {
    setRoa(roa)
    setShowAmount(!!roa || amount != null)
  }

  return <>
    <Card.Content style={{paddingVertical: 12, padding: 16}}>
      <InputSubstance
        value={substance} onChange={onChangeSubstance}
        returnTo='DoseList' style={{backgroundColor: 'transparent'}}
      />
      <ToggleView visible={showRoa}>
        <InputROA
          value={roa} onChange={onChangeRoa} substance={substance}
          startOpen={true} bgColor='transparent'
        />
      </ToggleView>
      <ToggleView visible={showAmount}>
        <InputAmount
          amount={amount} onChangeAmount={setAmount}
          substance={substance} roa={roa}
          unit={unit} onChangeUnit={setUnit}
          startOpen={true} bgColor='transparent'
        />
      </ToggleView>
      <InputDateTime visible={showDate} date={date} setDate={setDate}/>
      <InputNotes visible={showNotes} note={notes} setNote={setNotes}/>
    </Card.Content>
    <Card.Actions style={{marginRight: 16, marginBottom: 6}}>
      <Row style={{marginRight: 'auto'}}>
        <ToggleIcon icon='clock' value={showDate} onChange={setShowDate}/>
        <ToggleIcon icon='beaker' value={showAmount} onChange={setShowAmount}/>
        <ToggleIcon icon='eyedropper' iconOff='eyedropper' value={showRoa} onChange={setShowRoa}/>
        <ToggleIcon icon='note' value={showNotes} onChange={setShowNotes}/>
      </Row>
      <Button icon='plus' onPress={submit} disabled={!substance}>Add</Button>
    </Card.Actions>
  </>
}

function AddNoteForm({onSubmit=() => {}}) {
  const theme                     = useTheme()
  const [note,      setNote]      = useState('')
  const [date,      setDate]      = useState(null)
  const [showDate,  setShowDate]  = useState(false)

  function submit() {
    let data = {
      type: 'note',
      notes: note,
      date: (data.date ?? new Date()).getTime()
    }
    
    if (!edit)
      Dose.create(data)
    else
      Dose.edit(note.id, data)
    onSubmit()
    setNote('')
    setDate(null)
    setShowDate(false)
  }

  return <>
    <Card.Content style={{padding: 12}}>
      <InputNotes note={note} setNote={setNote}/>
      <InputDateTime visible={showDate} date={date} setDate={setDate}/>
    </Card.Content>
    <Card.Actions style={{marginRight: 16, marginBottom: 6}}>
      <Row style={{marginRight: 'auto'}}>
        <ToggleIcon icon='clock' value={showDate} onChange={setShowDate}/>
      </Row>
      <Button icon='plus' onPress={submit} disabled={!note}>Add</Button>
    </Card.Actions>
  </>
}
