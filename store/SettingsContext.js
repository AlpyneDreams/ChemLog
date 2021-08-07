import React from 'react'

export const SettingsContext = React.createContext({
  setDarkTheme: () => {},
  darkTheme: false
})