import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'
import { Divider, useTheme } from 'react-native-paper'
import { Portal, Dialog, Button, List, RadioButton } from 'react-native-paper'


export function ChooseDialog2({state, title, options={}, value, onChange, clear=true}) {
  const theme = useTheme()
  const [visible, setVisible] = state ?? useState(true)

  const close = () => setVisible(false)
  return (
    <Portal>
      <Dialog visible={visible} style={{maxHeight: 535}} onDismiss={close}>
        {title ? <Dialog.Title>{title}</Dialog.Title> : null}
        {title && <Divider bold/>}
        <ScrollView>
          {Object.keys(options).map(name => 
            <List.Item
              title={name}
              description={options[name].description}
              key={name}
              style={{paddingHorizontal: 16}}
              titleStyle={{marginBottom: 2}}
              onPress={() => {
                close()
                onChange(name, options[name])
              }}
              left={() =>
                <View pointerEvents='none'>
                  <RadioButton
                    status={value === name ? 'checked' : 'unchecked'}
                  />
                </View>}
            />  
          )}
        </ScrollView>
        <Divider bold/>
        <Dialog.Actions style={{paddingTop: 8}}>
          {clear && <Button onPress={() => {onChange(null); close()}}>Clear</Button>}
          <Button onPress={close}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
