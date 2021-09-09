import React, { useState } from 'react'
import { View } from 'react-native'
import { Portal, Dialog, Button, Paragraph, List, RadioButton, useTheme } from 'react-native-paper'


export default function ChooseDialog({state, title, options={}, value, onChange}) {
  const theme = useTheme()
  const [visible, setVisible] = state ?? useState(false)

  const close = () => setVisible(false)

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={close}>
        {title ? <Dialog.Title>{title}</Dialog.Title> : null}
        {Object.keys(options).map(name => 
          <List.Item
            title={name}
            key={name}
            style={{paddingHorizontal: 16}}
            titleStyle={{marginBottom: 2}}
            onPress={() => {
              close()
              onChange(options[name])
            }}
            left={() =>
              <View pointerEvents='none'>
                <RadioButton
                  color={theme.colors.primary}
                  status={value === options[name] ? 'checked' : 'unchecked'}
                />
              </View>}
          />  
        )}
        <Dialog.Actions>
          <Button uppercase={false} onPress={close}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}