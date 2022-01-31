import React from 'react'
import { View } from 'react-native'
import { Button, Title, useTheme, Chip } from 'react-native-paper'

export default function ShowMoreList({ children=[], labelShowMore='Show More', labelShowLess='Show Less', peekSize=8, ...props }) {

  const short = children.length <= peekSize
  const [more, showMore] = React.useState(false)

  if (!Array.isArray(children))
    children = [children]

  const items = more ? children : children.slice(0, peekSize)

  return <>
    <View {...props}>
      {items}
    </View>
    {!short ?
      <Button
        style={{ marginTop: 4 }}
        icon={more ? 'chevron-up' : 'chevron-down'}
        onPress={() => showMore(!more)}
      >
        {more ? labelShowLess : labelShowMore}
      </Button>
    : null}
  </>
}
