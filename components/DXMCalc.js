import React from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { Text, Card, Avatar, TextInput, ToggleButton, Title, DataTable, DefaultTheme, useTheme, Menu, Button, Divider, Provider, Caption } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import { useForcedUpdate } from '../util/Util'
import { Icon } from './Icon'
import GenericInput from './inputs/GenericInput'
import { Bold, CardCollapse, IconText, Row, Underline } from './Util'
import { DXM } from '../data/DXM'

const formList = Object.entries(DXM.forms)
const weightList = Object.entries(DXM.weight).map(
  ([key, value]) => ({label: key, value: value})
)

const titleProps = {
  title: 'DXM Calculator',
  subtitle: 'Dextromethorphan Dose',
  left: props => <Avatar.Icon {...props} icon="calculator" />
}

export default function DXMCalc({ startOpen=false }) {
  const [weight, setWeight] = React.useState(null)
  const [unit, setUnit] = React.useState(DXM.weight.kg)
  const [unitMenu, showUnits] = React.useState(false)
  const [formName, setForm] = React.useState(DXM.defaultForm)
  const [formMenu, showForms] = React.useState(false)

  const theme = useTheme()

  const form = DXM.forms[formName]

  let base
  if (weight != null)
    base = (weight * unit) / form.factor

  // TODO: Calculator output !!
  // TODO: Put button in DXM Substance page to open this calculator

  return (
    <CardCollapse titleProps={titleProps} startOpen={startOpen} style={{marginTop: 16, elevation: 0}}>
      <Card.Content style={{paddingBottom: 16}}>
        <Card
          mode='outlined'
          style={{
            backgroundColor: '#D5000022',
            borderColor: '#D50000', marginBottom: 8,
          }}
        >
          <Card.Content>
            <Text>
              <Icon icon='skull' color='#D50000' size={16}/>
              <Bold style={{color: '#D50000'}}> Warning</Bold> Only take products with DXM or DXM HBr as the <Underline><Bold>ONLY</Bold></Underline> active ingredient.
              Adulterants added to DXM can be deadly.
            </Text>
          </Card.Content>
          <Button
            uppercase={false} color='#D50000' icon='link' style={{margin: 8}}
            onPress={() => Linking.openURL("https://wiki.tripsit.me/wiki/DXM#Adulteration")}
          >
            More Info on Adulterants
          </Button>
        </Card>
        <Row style={{marginTop: 8, marginBottom: 12}}>
          {/* TODO: Warning about adulterants and shit - see ChemLogWeb & Tripsit*/}
          <TextInput
            label='My Weight'
            left={<TextInput.Icon name={unit == 'kg' ? 'weight-kilogram' : 'weight-pound'} color={theme.colors.placeholder} />}
            mode='outlined'
            keyboardType='numeric'
            onChangeText={amount => {
              if (amount == '')
                setWeight(null)
              let f = Number.parseFloat(amount)
              if (!Number.isNaN(f))
                setWeight(f)
            }}
            style={{flex: 1, marginEnd: 8}}
          />          
          <View style={{flex: 0.75}}>
            <DropDown
              label='Unit'
              mode='outlined'
              visible={unitMenu}
              showDropDown={() => showUnits(true)}
              onDismiss={() => showUnits(false)}
              setValue={setUnit}
              value={unit}
              list={weightList}
            />
          </View>
        </Row>
        <Menu
          visible={formMenu}
          onDismiss={() => showForms(false)}
          style={{marginTop: 64}}
          contentStyle={{width: 325}}
          anchor={
            <GenericInput
              label='Formulation'
              mode='outlined'
              value={form.name}
              icon='menu-down'
              left={
                <TextInput.Icon icon={form.icon} color={theme.colors.placeholder}/>
              }
              onPress={() => showForms(true)}
            />
          }
        >
          {formList.map(([id, form]) => (
            <Menu.Item
              key={id}
              value={id}
              title={form.name}
              icon={form.icon ?? DXM.defaultIcon}
              onPress={() => {setForm(id); showForms(false)}}
              style={{maxWidth: 325, width: 325}}
              titleStyle={[{width: 325}, formName === id ? {color: theme.colors.primary} : {}]}
            />
          ))}
        </Menu>
        <Card style={{elevation: 50, marginTop: 20, marginBottom: 8, overflow: 'hidden'}}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Plateau</DataTable.Title>
              <DataTable.Title>Minimum</DataTable.Title>
              <DataTable.Title>Maximum</DataTable.Title>
            </DataTable.Header>
            {DXM.plateaus.map(p => {
              let text = p.light ? styles.black : styles.white
              let [min, max] = p.factors
              let valid = base != null
              if (valid)
                [min, max] = [min * base, max * base].map(
                  m => m.toFixed(2) + ' ' + form.unit
                )
              else
                min = max = ''

              return (
                <DataTable.Row key={p.name} style={{backgroundColor: p.color}}>
                  <DataTable.Title><Title style={text}>{p.name}</Title></DataTable.Title>
                  <DataTable.Cell textStyle={text}>{min}</DataTable.Cell>
                  <DataTable.Cell textStyle={text}>{max}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </DataTable>
        </Card>
        <Button uppercase={false} icon='link' onPress={() => Linking.openURL('https://wiki.tripsit.me/wiki/DXM#Plateaus')}>
          More Info on DXM Plateaus
        </Button>
        <Caption>
          <Bold>Note</Bold> Always start low and work your way up until you find doses that are right for you.
          DXM is not always predictable and affects everyone differently, and higher plateaus are higher risk.
          Always check your math.
        </Caption>
        <Caption style={{marginTop: 4}}>Calculator originally designed by TripSit</Caption>
      </Card.Content>
    </CardCollapse>
  )
}

const styles = StyleSheet.create({
  black: {color: '#444'},
  white: {color: 'white'},
  toggleButton: {
    height: 56,
    width: 60,
    marginTop: 8,
  },
  btnRow: {
    width: 120
  }
})