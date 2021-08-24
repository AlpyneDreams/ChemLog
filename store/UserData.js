import React, { useEffect, useLayoutEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_PREFIX } from './Dose'
import Storage from './Storage'
import merge from 'lodash.merge'
import { useForcedUpdate } from '../util/Util'

const defaultUserData = {
  prefs: {
    darkTheme: true
  },

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
    <UserDataContext.Provider value={{...state, ...stateFunctions}}>
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
