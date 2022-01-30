import React from 'react'
import { List } from 'react-native-paper'

export default function Stat({label, value, children, style, ...props}) {

  // Visible if props.visible is not specified or if it is truthy or zero
  const visible = !('visible' in props) || props.visible || (props.visible === 0)
  delete props.visible

  return ((visible && (value ?? children)) ? 
    <List.Section {...props} style={[{flex: 1}, style]}>
      <List.Subheader>{label}</List.Subheader>
      <List.Item title={value} left={() => children} titleNumberOfLines={2} />
    </List.Section> : null
  )
}
