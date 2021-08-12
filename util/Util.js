import { useState } from 'react'
import { Platform } from 'react-native'

export const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

export function useForcedUpdate() {
  const [, setState] = useState()
  return setState
}