import React from 'react'
import { Caption } from 'react-native-paper'

export function Source({children, style, ...props}) {
  return <Caption style={[{textAlign: 'right', fontSize: 12}, style]} {...props}>Source: {children}</Caption>
}