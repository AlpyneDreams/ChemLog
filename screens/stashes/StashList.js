import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, Text, FAB, List, IconButton, useTheme, ActivityIndicator } from 'react-native-paper'
import CommonStyles from '../../components/CommonStyles'
import { StashStorage } from '../../store/Stash'
import Substances from '../../store/Substances'

export default function StashList() {
  const theme = useTheme()
  const navigation = useNavigation()

  function StashEntry({stash}) {

    const substance = Substances[stash.substance]
    const icon = substance?.icon ?? 'archive'

    return (
      <Card style={{margin: 8, marginTop: 0}} onPress={() => navigation.navigate('ItemDetails', {stash})}>
        <List.Item
          left={() => <List.Icon style={{margin: 8, marginLeft: 0, height: 40, width: 40}} color={substance?.color} icon={icon} />}
          title={stash.name}
          right={() => 
            <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{
                color: theme.colors.disabled,
                fontSize: 20,
                textAlign: 'right',
                marginEnd: 24,
              }}>
                {stash.amount != null ? `${stash.amount} ${stash.unit}` : null}
              </Text>
            </View>
          }
        />
      </Card>
    )
  }  

  const [loaded, setLoaded] = React.useState(false)

  useEffect(() => {
    if (!loaded)
      StashStorage.load().then(() => {
        setLoaded(true)
      })
  })

  const stashes = loaded ? StashStorage.items : []

  return (
    <View style={{ height: '100%' }}>
      {!loaded && <ActivityIndicator/>}
      {loaded && stashes.map(stash =>
        <StashEntry key={stash.id} stash={stash} />
      )}
      <FAB
        icon='plus'
        style={[CommonStyles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={() => navigation.navigate('AddStash')}
      />
    </View>
  )
}
