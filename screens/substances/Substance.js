import { setStatusBarStyle } from 'expo-status-bar'
import React from 'react'
import { ScrollView, View, Linking, LayoutAnimation } from 'react-native'
import { Button, Card, Divider, Subheading, Text, Title, useTheme } from 'react-native-paper'
import { Row } from '../../components/Util'
import substances, { Substances } from '../../store/Substances'
import { categories as CATEGORIES } from '../../store/Categories'
import CategoryChip from '../../components/substance/CategoryChip'
import SubstanceDose from '../../components/substance/SubstanceDose'
import SubstanceEffects from '../../components/substance/SubstanceEffects'
import SubstanceDuration from '../../components/substance/SubstanceDuration'
import SubstanceMisc from '../../components/substance/SubstanceMisc'
import SubstanceInteractions from '../../components/substance/SubstanceInteractions'
import { SubstanceDivider } from '../../components/substance/SubstanceDivider'
import { HeaderTitle } from '@react-navigation/elements'
import { Icon } from '../../components/Icon'
import { LayoutAnims } from '../../util/Util'
import SubstanceHistory from '../../components/substance/SubstanceHistory'
import DXMCalc from '../../components/DXMCalc'

export default function SubstanceScreen({navigation, route}) {

  const theme = useTheme()
  let {substance, pickerMode, returnTo} = route.params || {substance: {properties: {}}}
  let id

  if (typeof substance === 'string') {
    id = substance
    substance = substances[id]
  } else {
    id = substance?.name
  }
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: substance?.pretty_name || 'Substance',
      headerTitle: (props) => <Row>
        <Icon icon={substance.icon} size={20} color={substance.color} style={{marginTop: 4, marginRight: 4}} />
        <HeaderTitle {...props} />
      </Row>,
      headerRight: () => 
        <Button
          uppercase={false}
          icon='beaker-plus-outline'
          style={pickerMode ? {marginEnd: 8, borderRadius: 20} : {marginEnd: 8}}
          disabled={!substance}
          onPress={() => {
            navigation.navigate({
              name: pickerMode ? returnTo : 'AddDose', 
              params: {
                substance:{name: substance?.pretty_name, id: id},
              },
              merge: true
            })
          }}
        >{pickerMode ? 'Select' : 'New Dose'}</Button>
    })
    
    // In light theme, we need to invert the status bar
    // for TransitionPresets.ModalPresentationIOS
    if (!theme.dark) {
      setTimeout(() => {setStatusBarStyle('light')}, 100)

      return navigation.addListener('transitionStart', (e) => {
        if (e.data.closing)
          setStatusBarStyle('dark')
      })
    }

  }, [navigation, route])

  if (!substance)
    return <Title style={{paddingHorizontal: 20}}>Error: Unknown substance '{id}'</Title>

  let aliases = substance.properties?.aliases ?? substance.aliases
  let categories = substance.properties?.categories ?? substance.categories

  const hrt    = substance.custom && categories.includes('hormonal')
  const [showHRT, setShowHRT] = React.useState(false)

  categories = categories.map(c => CATEGORIES[c] ?? {}).sort((a, b) => a.priority - b.priority)

  const psy = substance.psychonaut

  return (
  <ScrollView>
  <View>
    <View style={{paddingHorizontal: 20, marginBottom: 12}}>

      {aliases ? 
        <Text style={{
          fontSize: 14, color: theme.colors.placeholder
        }}>{aliases.join(', ')}</Text>
      : null}

      {categories ?
        <Row style={{marginTop: 8, alignItems: 'stretch', flexWrap: 'wrap'}}>
          {categories.map(c => <CategoryChip key={c.name} category={c.name} />)}
        </Row>
      : null}

      <View style={{paddingVertical: 15}}>
        <Text>{substance.properties?.summary ?? ''}</Text>
      </View>

      <SubstanceMisc substance={substance} details={false} />

      <Row style={{justifyContent: 'space-evenly', flexGrow: 1}}>
        {!substance.custom && 
          <Button
            uppercase={false}
            icon='link'
            onPress={() => Linking.openURL(`https://drugs.tripsit.me/${id}`)}
          >
            TripSit
          </Button>
        }
        {!hrt &&
          <Button
            uppercase={false}
            icon={psy ? 'link' : 'magnify'}
            onPress={() => Linking.openURL(psy && psy.url ? psy.url : `https://psychonautwiki.org/w/index.php?search=${id}`)}
          >
            PsychonautWiki
          </Button>
        }
        {hrt &&
          <Button
            uppercase={false}
            icon='gender-transgender'
            onPress={() => {setShowHRT(!showHRT); LayoutAnimation.configureNext(LayoutAnims.ease)}}
          >
            HRT Resources
          </Button>
        }
      </Row>
      
      {showHRT && <HRTResources/>}

      {substance.name == 'dxm' && <>
        <DXMCalc startOpen={false} />
        <Divider/>
      </>}

    </View><Divider/>
      
    <SubstanceHistory substance={substance} />

    <View style={{paddingHorizontal: 20}}>

      <SubstanceEffects substance={substance} />

    </View>
    <Divider/>

    <SubstanceDose substance={substance} />
    
    <Divider/>  
    <View style={{paddingHorizontal: 20}}>
      <SubstanceDuration substance={substance} />
      <SubstanceDivider/>
    
      <SubstanceMisc substance={substance} details={true} />

      <SubstanceInteractions substance={substance} />
      <View style={{height: 20}} />
    </View>
  </View>
  </ScrollView>
  )
}

function HRTResources() {
  const Link = ({url, ...props}) => (
    <Button {...props} uppercase={false} contentStyle={{justifyContent: 'flex-start'}} onPress={() => Linking.openURL(url)}/>
  )
  return (
    <Card style={{marginTop: 8}}>
      <Card.Title title="HRT Resources"/>
      <Card.Content style={{alignItems: 'stretch', flexGrow: 1}}>
        <Subheading>Transfem</Subheading>
        <Link icon="file-document" url="https://d31kydh6n6r5j5.cloudfront.net/uploads/sites/161/2019/08/hormones_MTF.pdf">
          HRT Guide
        </Link>
        <Link icon="flask" url="https://transfemscience.org/">Transfeminine Science</Link>
        <Link icon="coffee" url="https://hrt.cafe">HRT.Cafe (DIY)</Link>

        <Subheading>Transmasc</Subheading>
        <Link icon="file-document" url="https://d31kydh6n6r5j5.cloudfront.net/uploads/sites/161/2019/08/hormones_FTM.pdf">
          HRT Guide
        </Link>
        <Link
          icon={(props) => <Icon {...props} icon={require('../../assets/icons/reddit.png')}/>}
          url="https://reddit.com/r/TransDIY/comments/95bvv1/ftm_hrt_diy_information/"
        >
          DIY Guide
        </Link>
      </Card.Content>
    </Card>
  )
}