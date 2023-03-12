import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, LayoutAnimation } from 'react-native'
import { Caption, Chip, TextInput, useTheme } from 'react-native-paper'
import GenericInput from './GenericInput'
import UserData from '../../store/UserData'
import SubstanceChip from '../substance/SubstanceChip'
import { Row } from '../Util'
import { Icon } from '../Icon'
import { LayoutAnims } from '../../util/Util'
import { RadioChips } from './RadioChips'
import Substances from '../../store/Substances'

/**
 * Substance picker input. Opens full screen substance list.
 * Caller is responsible for doing substance lookup after onChange.
 * @param {Object}    props
 * @param {*}         props.substance  Must be a full substance object.
 * @param {Function}  props.onChange   Gets called with {name, id} of new substance. 
 */
export default function InputSubstance({value: substance, onChange: changeValue, returnTo, style}) {
  const theme = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  let {recentSubstances} = UserData.useContext()

  // Check if substance is changed after return from SubstancePicker
  useEffect(() => {
    return navigation.addListener('focus', e => {
      if (route?.params?.substance)
        changeValue(route.params.substance)
    })
  }, [route?.params?.substance])

  recentSubstances = Object.fromEntries(recentSubstances.map(x => [x, Substances[x]]))

  function renderChip(s, onChange) {
    const isCurrent = substance?.name === s
    const isVisible = !substance || isCurrent
    const borderWidth = isVisible ? 1 : 0
    return (
      <SubstanceChip
        key={s}
        substance={s}
        colorful={isCurrent}
        onClose={isCurrent ? () => onChange(null) : null}
        onPress={() => onChange(!!substance ? null : Substances[s])}
        style={{
          ...(!substance ? {backgroundColor: 'transparent'} : {}),
          display: isVisible ? null : 'none', borderWidth,
          ...styles.chip
        }} />
    )
  }

  return <RadioChips
    label={substance ? 'Substance' : 'Choose Substance'}
    options={recentSubstances}
    value={substance} onChange={changeValue}
    renderChip={(s, onChange) => renderChip(s.name, onChange)}
    findMore={() => {
      navigation.navigate('SubstancePicker', {current: substance, returnTo})
    }}
  />
}

const styles = StyleSheet.create({
  chip: {marginRight: 6, marginVertical: 4, maxHeight: 36}
})