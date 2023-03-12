import { merge } from 'lodash'
import {
  MD3LightTheme as PaperLight,
  MD3DarkTheme as PaperDark,
  MD3Colors
} from 'react-native-paper'

import {
  DefaultTheme as NavLight,
  DarkTheme as NavDark,
} from '@react-navigation/native'

// Merge react-native-paper and react-navigation themes
// See https://callstack.github.io/react-native-paper/theming-with-react-navigation.html

export const DefaultTheme = merge(PaperLight, NavLight, {
  colors: {
    disabled: PaperLight.colors.onSurfaceDisabled,
    primary: '#7855ed', //PaperLight.colors.primary,
  }
})

export const DarkTheme = merge(PaperDark, NavDark, {
  colors: {
    disabled: PaperDark.colors.onSurfaceDisabled,
    primary: '#7855ed', //PaperLight.colors.primary,
    onPrimary: MD3Colors.primary100
  }
})
