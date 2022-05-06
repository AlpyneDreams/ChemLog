import { mergeWith, sortBy } from 'lodash'
import { useState, useRef, useEffect } from 'react'
import { Platform, LayoutAnimation, AppState } from 'react-native'
import dayjs from 'dayjs'

export const DAY_MS = 24*60*60*1000
export const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'

export const ICON_ADD_NOTE = require('../assets/icons/note-plus-outline.png')

// Like lodash.merge, but merges unique values from arrays
export function deepMerge(obj, ...args) {
  return mergeWith(Array.isArray(obj) ? [] : {}, obj, ...args, (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return Array.from(new Set(a.concat(b)))
    }
  })
}

export function range(n) {
  return [...Array(n).keys()]
}

export function separateByDate(items) {
  let list = items.slice()

  // Build a set of all calendar dates
  const dates = [...new Set(
    list.map(item => dayjs(item.date).endOf('day').valueOf())
  )]

  // Add those dates as objects to the dose list
  list.push(...(dates.map(date => ({type: 'date', date}))))

  // Sort by newest first
  return sortBy(list, item => -item.date)
}

/** React Hook: Forces a component to update */
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

/**
 * Calls an effect when the AppState changes. Use sparingly
 * as this registers a state and a global listener.
 * @param {(state: AppStateStatus, old: AppStateStatus) => void} listener
 * @returns {AppStateStatus} The current state.
 */
export function useAppStateEffect(listener) {
  const listenerRef             = useRef(listener)
  const appStateRef             = useRef(AppState.currentState)
  const [appState, setAppState] = useState(appStateRef.current)

  listenerRef.current = listener

  function appStateChanged(state) {
    listenerRef.current && listenerRef.current(state, appStateRef.current)
    setAppState(appStateRef.current = state)
  }

  useEffect(() => {
    AppState.addEventListener('change', appStateChanged)
    // Can't use listener.remove because addEventListener is returning undefined
    return () => {
      AppState.removeEventListener('change', appStateChanged)
    }
  }, [])

  return appState
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
