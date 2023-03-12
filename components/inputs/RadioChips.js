import { useState, useEffect } from 'react'
import { LayoutAnimation, StyleSheet, View } from 'react-native'
import { Caption, Chip, Text, useTheme } from 'react-native-paper'
import { LayoutAnims } from '../../util/Util'
import { Icon } from '../Icon'
import { Row } from '../Util'

/** Input where the user can choose one of an arbitrary number of chips */
export function RadioChips({label='Choose', renderChip, dependents=[], nameKey='name', idKey='name', findMore, options=[], value, onChange: changeValue}) {
  const theme = useTheme()
  if (Array.isArray(options))
    options = Object.fromEntries(options.map(x => typeof x === 'string' ? [x, {[nameKey]: x}] : [(x ?? {})[nameKey], x]))

  // Remember whatever substances were recently selected (even if not provided to us immediately)
  const [recentOptions, setRecents] = useState({})

  useEffect(() => {
    setRecents({})
  }, dependents)

  useEffect(() => {
    if (!value) return
    const name = (value ?? {})[idKey]
    if (name && !(name in options) && name)
      setRecents({...recentOptions, [name]: value})
  }, [value])

  options = {...options, ...recentOptions}

  const onChange = (x) => {
    LayoutAnimation.configureNext(LayoutAnims.ease)
    changeValue(x)
  }

  function render(v, onChange) {
    if (renderChip)
      return renderChip(v, onChange)
    const name = (v ?? {})[nameKey]
    const isCurrent = (value ?? {})[nameKey] === name
    const isVisible = !value || isCurrent
    const borderWidth = isVisible ? 1 : 0
    return (
      <Chip
        key={name}
        colorful={isCurrent}
        onClose={isCurrent ? () => onChange(null) : null}
        onPress={() => onChange(value ? null : v)}
        style={{
          ...(!value ? {backgroundColor: 'transparent'} : {}),
          display: isVisible ? null : 'none', borderWidth,
          ...styles.chip
        }}
      >{name}</Chip>
    )
  }

  return <View style={{marginBottom: 8}}>
    <Caption>{label}</Caption>
    <Row style={{flexWrap: 'wrap', alignItems: 'flex-start'}}>
      {Object.keys(options).map(key => render(options[key], onChange))}
      {value && !((value ?? {})[nameKey] in options) && render(value, onChange)}
      {!value && findMore && (
        <Chip mode='flat'
          selected={false}
          style={styles.chip}
          icon={({size, color: iconColor}) => 
            <Icon icon={'plus'} color={theme.colors.onSurface} size={size}/>
          }
          onPress={findMore}
        >More</Chip>
        )}
    </Row>
  </View>
}

const styles = StyleSheet.create({
  chip: {marginRight: 6, marginVertical: 4, maxHeight: 36}
})
