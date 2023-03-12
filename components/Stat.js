import React from 'react'
import { List } from 'react-native-paper'

export default function Stat({label, value, children, style, ...props}) {

  // Visible if props.visible is not specified or if it is truthy or zero
  const visible = !('visible' in props) || props.visible || (props.visible === 0)
  delete props.visible

  // Zero value is valid too
  const hasValue = value || value === 0

  return (props.visible === true || (visible && (hasValue || children)) ? 
    <List.Section {...props} style={[{flex: 1}, style]}>
      <List.Subheader style={{opacity: 0.8}}>{label}</List.Subheader>
      <List.Item title={value} left={() => children} titleNumberOfLines={2} style={{paddingTop: 0}} />
    </List.Section> : null
  )
}
