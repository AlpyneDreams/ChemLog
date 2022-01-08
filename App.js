import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useColorScheme, Platform, StyleSheet, Text, View } from 'react-native'
import { Button, Appbar, IconButton, Provider as PaperProvider, useTheme } from 'react-native-paper'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import DoseList from './screens/doses/DoseList'
import StashList from './screens/stashes/StashList'
import AddStash from './screens/stashes/AddStash'
import Settings from './screens/Settings'
import SubstanceList from './screens/substances/SubstanceList'
import SubstanceView from './screens/substances/Substance'
import AddDose from './screens/doses/AddDose'
import AddNote from './screens/doses/AddNote'
import DoseDetails from './screens/doses/DoseDetails'
import { DarkTheme, DefaultTheme } from './util/Theme'
import UserData from './store/UserData'
import { CloseBackButton } from './components/Util'
import { UIManager } from 'react-native'
import { merge } from 'lodash'

// Configure day.js
import './util/dayjs'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

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
  const theme = useTheme()

  return (
    <Tab.Navigator>
      <Tab.Screen
        name='DoseList'
        component={DoseList}
        options={{
          title: 'Doses', tabBarLabel: 'Doses',
          headerStyle: {backgroundColor: theme.colors.background, elevation: 0},
          tabBarIcon: ({focused, color, size}) => 
            <IconButton icon={focused ? 'beaker' : 'beaker-outline'} color={color} size={size} />
        }}
      />
      {/*<Tab.Screen
        name='StashList'
        component={StashList}
        options={{
          title: 'Stashes', tabBarLabel: 'Stashes',
          headerStyle: {backgroundColor: theme.colors.background, elevation: 0},
          tabBarIcon: ({focused, color, size}) => 
            <IconButton icon={focused ? 'archive' : 'archive-outline'} color={color} size={size} />
        }}
      />*/}
      <Tab.Screen
        name='SubstanceList'
        component={SubstanceList}
        options={{
          title: 'Substances', tabBarLabel: 'Substances',
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => 
            <IconButton icon='pill' color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {

  return (
    <UserData.Provider>
      <AppLayout />
    </UserData.Provider>
  )
}

function getTheme(themePref, systemPref) {
  switch (themePref) {
    case true:  return DarkTheme
    case false: return DefaultTheme
    
    // System default
    case null:
    default:
      switch (systemPref) {
        case 'light': return DefaultTheme
        case 'dark':  return DarkTheme
        
        default:
        case null:
          return DarkTheme
      }
  }
}

function AppLayout() {
  const userData = UserData.useContext()
  const theme = getTheme(userData.prefs?.darkTheme, useColorScheme())


  return (
    /*<View>
      <StatusBar style="light" />
      {/*<Appbar.Header>
        <Appbar.Action icon="menu"></Appbar.Action>
        <Appbar.Content title="Title" subtitle="Subtitle"/>
        <Appbar.Action icon="magnify"></Appbar.Action>
        <Appbar.Action icon={MORE_ICON}></Appbar.Action>
      </Appbar.Header>}*/
      <SafeAreaProvider>
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
                <Stack.Screen name='Settings' component={Settings} options={{headerStyle: {backgroundColor: theme.colors.background, elevation: 0}}} />
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
                    headerLeft: CloseBackButton
                  })}
                />
                <Stack.Screen
                  name='AddNote'
                  component={AddNote}
                  options={({navigation}) => ({
                    title: 'Add Note', presentation: 'modal'
                  })}
                />
                <Stack.Screen
                  name='EditNote'
                  component={AddNote}
                  initialParams={{edit: true}}
                  options={({navigation}) => ({
                    title: 'Edit Note',
                    presentation: 'modal',
                    headerLeft: CloseBackButton
                  })}
                />
                <Stack.Screen
                  name='DoseDetails'
                  component={DoseDetails}
                  options={{
                    headerStyle: {backgroundColor: theme.colors.surface, elevation: 0},
                    cardStyle: {backgroundColor: theme.colors.surface},
                    ...merge(TransitionPresets.DefaultTransition, {
                      transitionSpec: {
                        open: {config: {duration: 125}},
                        close: {config: {duration: 125}}
                      }
                    })

                  }}
                />
                <Stack.Screen
                  name='AddStash'
                  component={AddStash}
                  options={({navigation}) => ({
                    title: 'Add Stash', presentation: 'modal'
                  })}
                />
                <Stack.Screen
                  name='Substance'
                  component={SubstanceView}
                  options={{
                    headerLeft: CloseBackButton,
                    headerStyle: {backgroundColor: theme.dark ? theme.colors.surface : theme.colors.background, elevation: 0},
                    cardStyle: {backgroundColor: theme.dark ? theme.colors.surface : theme.colors.background},
                    gestureEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                  }}
                />
                <Stack.Screen
                  name='SubstancePicker'
                  component={SubstanceList}
                  initialParams={{pickerMode: true}}
                  options={{title: 'Select a substance', ...TransitionPresets.ModalSlideFromBottomIOS}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </PaperProvider>
      </SafeAreaProvider>
  )
}
