import React from 'react'
import { View, LayoutAnimation } from 'react-native'
import { useTheme, Button, IconButton, Text, TouchableRipple } from 'react-native-paper'
import { LayoutAnims, range } from '../util/Util'
import { Row } from './Util';

export function TabButton({ active, setActive, icon, children, style }) {
  const theme = useTheme();

  return <TouchableRipple
    style={{flex: 1, position: 'relative', top: 3}}
    onPress={() => {
        setActive(true);
        LayoutAnimation.configureNext(LayoutAnims.ease);
      }}
    >
    <View style={{alignItems: 'center'}}>
      {icon && <IconButton icon={icon} size={24} style={{marginBottom: -10}} iconColor={active ? theme.colors.primary : theme.colors.disabled}  />}
      <Button
        uppercase={false}
        textColor={!active && theme.colors.disabled}
        style={[
          { borderRadius: 0, marginBottom: -2 },
          style,
          //active && {borderBottomColor: theme.colors.primary, borderBottomWidth: 2},
        ]}
        
      >{children}</Button>
    </View>
  </TouchableRipple>
}

export function TabBar({n = 2, names = ['Tab 1', 'Tab 2'], icons=[], tab = 0, setTab}) {
  const theme = useTheme()
  const width = 30
  return (<>
    <Row style={{justifyContent: 'space-evenly'}}>
      {range(n).map(i =>
        <TabButton key={`tab${i}`} active={tab === i} icon={icons[i]} setActive={v => setTab(i)}>{names[i]}</TabButton>
      )}
    </Row>
    <Row>
      <View style={[
        {width: `${width*(1/n)}%`, height: 3, backgroundColor: theme.colors.primary, borderTopLeftRadius: 2, borderTopRightRadius: 4},
        {marginLeft: `${100*(tab/n) + ((100-width)/4)}%`}
      ]}/>
    </Row>
  </>)
}