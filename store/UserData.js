import React, { useEffect, useLayoutEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_PREFIX } from './Dose'
import Storage from './Storage'
import merge from 'lodash.merge'
import { useForcedUpdate } from '../util/Util'

const MAX_RECENT_SUBSTANCES = 20

const defaultUserData = {
  prefs: {
    darkTheme: true
  },
  recentSubstances: [],

  setDarkTheme: () => {},
}

async function load() {
  return await Storage.get('userdata', defaultUserData)
}

async function save(data) {
  return await Storage.set('userdata', data ?? defaultUserData)
}

const UserDataContext = React.createContext(defaultUserData)

// This is a function component to provide
// persistant state across reloads.
function UserDataProvider({children}) {

  const forceUpdate = useForcedUpdate()
  const [state, setState] = React.useState(defaultUserData)
  const mounted = React.useRef()

  // Update (and save data)
  const update = (data) => {
    let obj = merge({}, defaultUserData, state, data)
    setState(obj)
    save(obj)
  }

  // UserData functions that use update()
  const stateFunctions = {
    setDarkTheme: (darkTheme) => update({prefs: {darkTheme}}),
    addRecentSubstance: (id) => {
      let idx = state.recentSubstances.indexOf(id)
      if (idx >= 0) {
        state.recentSubstances.splice(idx, 1)
      }
      state.recentSubstances.unshift(id)
      state.recentSubstances = state.recentSubstances.slice(0, MAX_RECENT_SUBSTANCES)
      save(state)
      forceUpdate()
    }
  }

  // Load user data on mount (can't use top-level await)
  useEffect(() => {
    if (!mounted.current) {
      load().then(data => {
        //console.log('User data retrieved: ', data)
        if (mounted.current) {
          setState(data)
        }
      })

      mounted.current = true
    }
  })

  return (
    <UserDataContext.Provider value={merge(state, stateFunctions)}>
      {children}
    </UserDataContext.Provider>
  )
}

export const UserData = {
  Provider: UserDataProvider,
  Context: UserDataContext,

  useContext: () => React.useContext(UserDataContext)
}

export default UserData
