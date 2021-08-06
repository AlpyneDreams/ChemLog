import React from 'react'
import { useEffect } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native'
import { Button, Text, View } from "react-native";
import { FAB, List, Snackbar } from 'react-native-paper';
import Dose from '../store/Dose'

export default function HomeScreen({navigation, route}) {

  const [snackbar, setSnackbar] = React.useState(true)

  useEffect(() => {
    setSnackbar(true)
  }, [navigation, route])

  return (
    <View style={{height: '100%'}}>
      <List.Section>
        <List.Subheader>Recent Doses</List.Subheader>

        {Dose.doses.map((dose, index) => {
          
          return (
            <List.Item
              key={dose.id}
              title={dose.substance}
              description={dose.amount ? `${dose.amount} ${dose.unit??''}` : null}
              onPress={() => navigation.navigate('DoseDetails', dose)}
              left={() =>
                <List.Icon icon='pill' />
              }
              style={{
                backgroundColor: 'white',
                ...(index > 0 ? {
                  borderTopColor: '#e0e0e0',
                  borderTopWidth: 1
                } : {})
              }}
            />
          )
        })}

      </List.Section>
      <FAB
        style={styles.fab}
        icon='plus'
        onPress={() => navigation.navigate('AddDose')}
      />
      <Snackbar 
        visible={route.params < 0 && snackbar}
        duration={1000}
        onDismiss={(e) => setSnackbar(false)}
      >Dose deleted.</Snackbar>
      {/*<Text>Open up App.js to start working on your app!</Text>
      <Button title="Go to details" onPress={() => navigation.navigate('Details')}/>*/}
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    marginBottom: 48,
    right: 0,
    bottom: 0
  }
})