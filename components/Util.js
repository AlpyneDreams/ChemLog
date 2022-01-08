import React from 'react'
import { LayoutAnimation, View, ViewProps } from 'react-native'
import { Card, IconButton, TouchableRipple, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { LayoutAnims } from '../util/Util'

/**
 * @param {ViewProps} props
 */
export function Row(props) {
  return <View
    {...props}
    style={[{
      flexDirection: 'row',
      alignItems: 'flex-start'
    }, props.style]}
  />
}

export function Bold(props) {
  return <Text {...props} style={[props?.style, {fontWeight: 'bold'}]} />
}

export function CloseBackButton({navigation}) {
  navigation = navigation ?? useNavigation()
  return <IconButton icon='close' onPress={() => navigation.goBack()}/>
}

export function CardCollapse({ titleProps, children, ...props }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnims.ease)
    setCollapsed(!collapsed)
  }

  return (
    <Card {...props}>
      <TouchableRipple onPress={toggle}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ flex: 1 }}>
            <Card.Title {...titleProps} />
          </View>
          <IconButton icon={collapsed ? 'chevron-down' : 'chevron-up'} color={titleProps?.titleStyle?.color} />
        </Row>
      </TouchableRipple>
      {!collapsed ? children : null}
    </Card>
  )
}
