import { mergeWith } from 'lodash'
import { useState } from 'react'
import { Platform, LayoutAnimation } from 'react-native'

export const DAY_MS = 24*60*60*1000
export const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

export const ICON_ADD_NOTE = require('../assets/icons/note-plus-outline.png')

// Like lodash.merge, but merges unique values from arrays
export function deepMerge(obj, ...args) {
  return mergeWith({}, obj, ...args, (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return Array.from(new Set(a.concat(b)))
    }
  })
}

export function useForcedUpdate() {
  const [, setState] = useState()
  return setState
}

/** React Hook: Returns the previous value of prop, if it has changed. */
export function usePrevious(prop) {
  const [current, setCurrent] = useState(prop)
  const [prev, setPrev] = useState(prop)
  if (prop !== current) {
    setPrev(current)
    setCurrent(prop)
  }
  return prev
}

export const LayoutAnims = {
  ease: {
    ...LayoutAnimation.Presets.easeInEaseOut,
    duration: 200
  }
}

// Debug: slowly(fn) returns a function that calls fn(...) after a second
function slowly(action) {
  return (...args) => setTimeout(action, 1000, ...args)
}
