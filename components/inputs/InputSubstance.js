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

  // Remember whatever substances were recently selected (even if not recorded)
  {
    const [localRecentSubstances, setLocalRecents] = useState([])
    useEffect(() => {
      if (substance && !recentSubstances.includes(substance.name))
        setLocalRecents([...localRecentSubstances, substance.name])
    }, [substance])

    recentSubstances = recentSubstances.concat(localRecentSubstances)
  }

  // Check if substance is changed after return from SubstancePicker
  useEffect(() => {
    return navigation.addListener('focus', e => {
      if (route?.params?.substance)
        onChange(route.params.substance)
    })
  }, [route?.params?.substance, substance])

  const onChange = (x) => {
    LayoutAnimation.configureNext(LayoutAnims.ease)
    changeValue(x)
  }

  function renderChip(s) {
    const isCurrent = substance?.name === s
    const isVisible = !substance || isCurrent
    const borderWidth = isVisible ? 1 : 0
    return (
      <SubstanceChip
        key={s}
        substance={s}
        colorful={isCurrent}
        onClose={isCurrent ? () => onChange(null) : null}
        onPress={() => onChange(!!substance ? null : {id: s})}
        style={{
          backgroundColor: !substance ? 'transparent' : null,
          display: isVisible ? null : 'none', borderWidth,
          ...styles.chip
        }} />
    )
  }

  return <View style={{marginBottom: 8}}>
    <Caption>{substance ? 'Substance' : 'Choose Substance'}</Caption>
    <Row style={{flexWrap: 'wrap', alignItems: 'flex-start'}}>
      {recentSubstances.map(renderChip)}
      {substance && !recentSubstances.includes(substance.name) && renderChip(substance.name)}
      {!substance && (
        <Chip mode='flat'
          selected={false}
          style={styles.chip}
          icon={({size, color: iconColor}) => 
            <Icon icon={'plus'} color={theme.colors.onSurface} size={size}/>
          }
          onPress={() => {
            navigation.navigate('SubstancePicker', {current: substance?.id, returnTo})
          }}
        >More</Chip>
      )}
    </Row>
  </View>

  return (
    <GenericInput
      label='Substance'
      mode='flat'
      value={substance?.pretty_name}
      left={substance ? <TextInput.Icon icon={substance.icon} color={() => substance.color}/> : null}
      right={<TextInput.Icon icon='menu-down'/>}
      onPress={() => {
        if (substance)
          onChange(null)
        else
          navigation.navigate('SubstancePicker', {current: substance?.id, returnTo})
      }}
      inputStyle={style}
    />
  )
}

const styles = StyleSheet.create({
  chip: {marginRight: 6, marginVertical: 4, maxHeight: 36}
})