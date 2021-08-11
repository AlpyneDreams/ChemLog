import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { Button, Appbar, IconButton, Provider as PaperProvider } from 'react-native-paper'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import DoseList from './screens/DoseList'
import SubstanceList from './screens/SubstanceList'
import SubstanceView from './screens/Substance'
import AddDose from './screens/AddDose'
import DoseDetails from './screens/DoseDetails'
import { DarkTheme, DefaultTheme } from './util/Theme'
import { SettingsContext } from './store/SettingsContext'

// Configure day.js
import './util/dayjs'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

/*function Navbar({navigation, back}) {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="ChemLog"/>
    </Appbar.Header>
  )
}*/

function HeaderLeft() {
  return (
    <IconButton icon='menu' />
  )
}


function Home({ navigation, route }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='DoseList'
        component={DoseList}
        options={{
          title: 'Doses', tabBarLabel: 'Doses',
          tabBarIcon: ({focused, color, size}) => 
            <IconButton icon={focused ? 'beaker' : 'beaker-outline'} color={color} size={size} />
        }}
      />
      <Tab.Screen
        name='SubstanceList'
        component={SubstanceList}
        options={{
          title: 'Substances', tabBarLabel: 'Substances',
          tabBarIcon: ({focused, color, size}) => 
            <IconButton icon='pill' color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  )
}

function CloseBackButton() {
  const navigation = useNavigation()
  return <IconButton icon='close' onPress={() => navigation.goBack()}/>
}

export default function App() {
  const [darkTheme, setDarkTheme] = React.useState(true)

  let theme = darkTheme ? DarkTheme : DefaultTheme

  const settings = React.useMemo(
    () => ({setDarkTheme,darkTheme}),
    [setDarkTheme, darkTheme]
  )

  return (
    /*<View>
      <StatusBar style="light" />
      {/*<Appbar.Header>
        <Appbar.Action icon="menu"></Appbar.Action>
        <Appbar.Content title="Title" subtitle="Subtitle"/>
        <Appbar.Action icon="magnify"></Appbar.Action>
        <Appbar.Action icon={MORE_ICON}></Appbar.Action>
      </Appbar.Header>}*/
    <SettingsContext.Provider value={settings}>
      <PaperProvider theme={theme}>
        <View style={{height: '100%', alignItems: 'center', backgroundColor: theme.colors.background}}>
          <View style={{maxWidth: 600, width: '100%', height: '100%'}}>
            <StatusBar style={theme.dark ? 'light' : 'dark'} />
            <NavigationContainer theme={theme}>
              <Stack.Navigator
                initialRouteName='Home'
                screenOptions={{
                  //headerLeft: HeaderLeft
                  //headerShown: false,
                  //gestureEnabled: true,
                  //...TransitionPresets.ModalPresentationIOS
                }}
              >
                <Stack.Screen name='Home' component={Home} options={{headerShown: false}} />
                <Stack.Screen
                  name='AddDose'
                  component={AddDose}
                  options={({navigation}) => ({
                    title: 'Add Dose', presentation: 'modal'
                  })}
                />
                <Stack.Screen
                  name='EditDose'
                  component={AddDose}
                  initialParams={{edit: true}}
                  options={({navigation}) => ({
                    title: 'Edit Dose',
                    presentation: 'modal',
                    headerLeft: () => <IconButton icon='close' onPress={() => navigation.goBack()}/>
                  })}
                />
                <Stack.Screen name='DoseDetails' component={DoseDetails} />
                <Stack.Screen
                  name='Substance'
                  component={SubstanceView}
                  options={{
                    headerLeft: CloseBackButton,
                    headerStyle: {backgroundColor: theme.colors.surface, elevation: 0},
                    cardStyle: {backgroundColor: theme.colors.surface},
                    gestureEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                  }}
                />
                <Stack.Screen
                  name='SubstancePicker'
                  component={SubstanceList}
                  initialParams={{pickerMode: true}}
                  options={{title: 'Select a substance', ...TransitionPresets.BottomSheetAndroid}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </PaperProvider>
    </SettingsContext.Provider>
  )
}
