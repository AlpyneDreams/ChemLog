import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { Button, Appbar, IconButton, Provider as PaperProvider } from 'react-native-paper'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './screens/Home'
import AddDose from './screens/AddDose'
import DoseDetails from './screens/DoseDetails'
import { DarkTheme, DefaultTheme } from './util/Theme'
import { SettingsContext } from './store/SettingsContext'

const Stack = createStackNavigator()

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
        <View style={{height: '100%', alignItems: 'center'}}>
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
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen
                  name='AddDose'
                  component={AddDose}
                  options={({navigation}) => ({
                    title: 'Add Dose',
                    presentation: 'modal',
                    ...TransitionPresets.ModalSlideFromBottomIOS
                  })}
                />
                <Stack.Screen name='DoseDetails' component={DoseDetails} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </PaperProvider>
    </SettingsContext.Provider>
  )
}
