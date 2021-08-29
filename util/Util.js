import { useState } from 'react'
import { Platform, LayoutAnimation } from 'react-native'

export const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

export function useForcedUpdate() {
  const [, setState] = useState()
  return setState
}

export const LayoutAnims = {
  ease: {
    ...LayoutAnimation.Presets.easeInEaseOut,
    duration: 200
  }
}