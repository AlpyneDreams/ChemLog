import { merge } from 'lodash'
import {
  DefaultTheme as PaperLight,
  DarkTheme as PaperDark
} from 'react-native-paper'

import {
  DefaultTheme as NavLight,
  DarkTheme as NavDark,
} from '@react-navigation/native'

// Merge react-native-paper and react-navigation themes
// See https://callstack.github.io/react-native-paper/theming-with-react-navigation.html

export const DefaultTheme = merge(PaperLight, NavLight, {
  colors: {
    primary: PaperLight.colors.primary
  }
})

export const DarkTheme = merge(PaperDark, NavDark, {
  colors: {    
    primary: '#7855ed' //PaperLight.colors.primary
  }
})
