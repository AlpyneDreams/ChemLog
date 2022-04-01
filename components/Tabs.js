import React from 'react'
import { LayoutAnimation } from 'react-native'
import { useTheme, Button } from 'react-native-paper'
import { LayoutAnims } from '../util/Util'

export function TabButton({ active, setActive, children, style }) {
  const theme = useTheme();

  return <Button
    uppercase={false}
    color={!active && theme.colors.disabled}
    style={[
      { borderRadius: 0, flex: 1 },
      style,
      //active && {borderBottomColor: theme.colors.primary, borderBottomWidth: 2},
    ]}
    onPress={() => {
      setActive(true);
      LayoutAnimation.configureNext(LayoutAnims.ease);
    }}
  >{children}</Button>;
}
