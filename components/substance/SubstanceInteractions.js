import React from 'react'
import { Caption, DataTable, Title, Text, useTheme, Card, Subheading } from 'react-native-paper'
import { styles } from './common'
import { CardCollapse } from '../Util'
import SubstanceChip from './SubstanceChip'
import Substances from '../../store/Substances'
import Groups from '../../data/tripsit.groups.json'
import Interactions from '../../data/Interactions'
import _ from 'lodash'

const decompose = Object.entries
const compose = Object.fromEntries

function groupName(name) {
  if (name in Groups) {
    return Groups[name].pname
  }

  if (name in Substances) {
    return Substances[name].pretty_name
  }

  return name
}

export default function SubstanceInteractions({substance}) {
  const theme = useTheme()

  if (!substance.combos) return null

  let combos = _.groupBy(
    decompose(substance.combos).map(([name, data]) => ({name, ...data})),
    group => group.status
  )

  combos = compose(_.sortBy(decompose(combos), ([key, value]) => Interactions[key]?.order ?? 0))

  return <>
    <Title style={styles.header}>Interactions</Title>

    {Object.entries(combos).map(
      ([status, groups]) => {

        let data = Interactions[status] ?? {}

        return (
          <Card
            key={status}
            style={[
              {marginBottom: 12},
              data ? { borderColor: data.color, backgroundColor: data.color + '11' } : null
            ]}
            mode='outlined'
            titleProps={{
              title: data.name ?? status,
              titleStyle: {color: data.color},
              subtitle: data.subtitle,
              subtitleStyle: {color: data.color, fontSize: 15}
            }}
          >
            <Card.Title
              title={data.name ?? status}
              titleStyle={{color: data.color}}
              subtitle={data.subtitle}
              subtitleStyle={{color: data.color, fontSize: 15}}
            />
            <Card.Content>
              {groups.map(group => {
                return (<React.Fragment key={group.name}>
                  <Subheading style={{opacity: 0.7}}>{groupName(group.name)}</Subheading>
                  {group.note &&
                    <Text style={{marginBottom: 12}}>{group.note}</Text>
                  }
                </React.Fragment>)
              })}
            </Card.Content>
          </Card>
        )
      }
    )}

  </>
}


