import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { Button, Appbar, IconButton, Provider as PaperProvider, useTheme } from 'react-native-paper'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import DoseList from './screens/DoseList'
import SubstanceList from './screens/SubstanceList'
import SubstanceView from './screens/Substance'
import AddDose from './screens/AddDose'
import AddNote from './screens/AddNote'
import DoseDetails from './screens/DoseDetails'
import { DarkTheme, DefaultTheme } from './util/Theme'
import UserData from './store/UserData'
import { CloseBackButton } from './components/Util'
import { UIManager } from 'react-native'

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

function AppLayout() {
  const userData = UserData.useContext()
  const theme = userData.prefs?.darkTheme ? DarkTheme : DefaultTheme

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
                    cardStyle: {backgroundColor: theme.colors.surface}
                  }}
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
