import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useReducer } from 'react'
import { TextInput } from 'react-native-paper'
import GenericInput from './GenericInput'
import Substances from '../../store/Substances'

/**
 * Substance picker input. Opens full screen substance list.
 * Caller is responsible for doing substance lookup after onChange.
 * @param {Object}    props
 * @param {*}         props.substance  Must be a full substance object.
 * @param {Function}  props.onChange   Gets called with {name, id} of new substance. 
 */
export default function InputSubstance({value: substance, onChange, returnTo}) {
  const navigation = useNavigation()
  const route = useRoute()

  // Check if substance is changed after return from SubstancePicker
  useEffect(() => {
    return navigation.addListener('focus', e => {
      if (route?.params?.substance)
        onChange(route.params.substance)
    })
  }, [route?.params?.substance, substance])

  return (
    <GenericInput
      label='Substance'
      mode='flat'
      value={substance?.pretty_name}
      left={substance ? <TextInput.Icon name={substance.icon} color={substance.color}/> : null}
      right={<TextInput.Icon name='menu-down'/>}
      onPress={() => {
        navigation.navigate('SubstancePicker', {current: substance?.id, returnTo})
      }}
    />
  )
}