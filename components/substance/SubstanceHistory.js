import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Title, useTheme, Chip, Caption, ActivityIndicator, Card, Text, List, Divider } from 'react-native-paper'
import EffectChip from '../effects/EffectChip'
import ShowMoreList from '../ShowMoreList'
import { styles } from './common'
import { Dose } from '../../store/Dose'
import { Row } from '../Util'
import Stat from '../Stat'
import DoseEntry from '../doses/DoseEntry'
import DateGroupedList from '../DateGroupedList'
import { sumAvgAmounts } from '../../store/Units'
import { useNavigation } from '@react-navigation/native'


export default function SubstanceHistory({ substance }) {
  const theme = useTheme()
  const navigation = useNavigation()

  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    const doses = Dose.store.items.filter(d => d.substance === substance.name)
    let numDoses = doses.length
    let [sum, sumUnit, avg, avgUnit] = sumAvgAmounts(doses)
    setData({
      doses,
      numDoses,
      numStashes: 0,
      amountUsed: `${parseFloat(sum.toFixed(2))} ${sumUnit}`, // parseFloat removes trailing zeroes
      averageDose: `${parseFloat(avg.toFixed(2))} ${avgUnit}`

    })
    setLoaded(true)
  }, [])

  function addDose() {
    navigation.navigate({
      name: 'AddDose',
      params: {
        substance: {name: substance?.pretty_name, id: substance?.name},
      },
      merge: true
    })
  }

  function addStash() {
    navigation.navigate({
      name: 'AddStash',
      params: {
        substance: {name: substance?.pretty_name, id: substance?.name},
      },
      merge: true
    })
  }

  let btnDose = '', btnStash
  if (loaded) {
    btnDose = `${data.numDoses} Dose${data.numDoses === 1 ? '' : 's'}`
    btnStash = `${data.numStashes} Stash${data.numStashes === 1 ? '' : 'es'}`
  }

  return <>
    <View style={{paddingHorizontal: 20}}>
      <Title style={styles.header}>History</Title>
      {!loaded && <ActivityIndicator/>}
      {loaded && (data.numDoses === 0 ? <>
        <Caption>You have never recorded any doses for {substance.pretty_name}.</Caption>
      </> : <>
        <Row>
          <Stat label='Total Doses' value={data.numDoses} />
          <Stat label='Total Used' value={data.amountUsed} />
          <Stat label='Average Dose' value={data.averageDose} style={{flex: 1.25}} />
        </Row>
      </>)}
    </View>
    {loaded && data.numDoses > 0 ? <>
      <Divider/>
      <ShowMoreList peekSize={0} labelShowMore='Show Doses' labelShowLess='Hide Doses'>
        <View style={{paddingHorizontal: 20}}>
          <AddButtons addDose={addDose} addStash={addStash} />
          <DateGroupedList
            items={data.doses}
            entry={(dose, index) =>
              <DoseEntry key={index} dose={dose} index={index} elevated={true} />
            }
          />
        </View>
      </ShowMoreList>
    </> : <>
      <View style={{height: 20}}/>
    </>}
    <Divider/>
  </>
}

function AddButtons({addDose, addStash}) {
  return (
    <Row style={{justifyContent: 'space-evenly', flexGrow: 1, marginTop: 20}}>
      <Button onPress={addDose} mode='outlined' uppercase={false} icon='beaker-plus-outline'>
        New Dose
      </Button>
      {/*<Button onPress={addStash} mode='outlined' uppercase={false} icon={require('../../assets/icons/archive-plus-outline.png')}>
        New Stash
      </Button>*/}
    </Row>
  )
}