import React from 'react'
import { View, LayoutAnimation } from 'react-native'
import { useTheme, Button } from 'react-native-paper'
import { LayoutAnims, range } from '../util/Util'
import { Row } from './Util';

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

export function TabBar({n = 2, names = ['Tab 1', 'Tab 2'], tab = 0, setTab}) {
  const theme = useTheme()
  return (<>
    <Row style={{justifyContent: 'space-evenly'}}>
      {range(n).map(i =>
        <TabButton key={`tab${i}`} active={tab === i} setActive={v => setTab(i)}>{names[i]}</TabButton>
      )}
    </Row>
    <Row>
      <View style={[
        {width: `${100*(1/n)}%`, height: 2, backgroundColor: theme.colors.primary},
        {marginLeft: `${100*(tab/n)}%`}
      ]}/>
    </Row>
  </>)
}