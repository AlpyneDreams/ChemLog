import React from 'react'
import { FAB, HelperText, TextInput, useTheme } from 'react-native-paper'
import { Row } from '../Util'


export default React.forwardRef(({submit, value, onChange, valid=true, icon='lock-open', disabled=false, secure=true}, ref) => {
  const theme = useTheme()

  const disableSubmit = !valid || disabled

  return (<>
    <Row style={{alignItems: 'flex-end', marginBottom: 8}}>
      <TextInput ref={ref} disabled={disabled}
        style={{backgroundColor: 'transparent', flexGrow: 1, marginRight: 8, textAlign: 'center', fontSize: 30}}
        mode='outlined' autoFocus={true}
        secureTextEntry={secure} keyboardType='number-pad'
        value={value} onChangeText={onChange} blurOnSubmit={false} onSubmitEditing={() => submit(value)}
      />
      <FAB
        style={{borderRadius: theme.roundness, backgroundColor: theme.colors.primary}}
        icon={icon} color={disableSubmit ? '#FFFFFF66' : 'white'}
        onPress={() => submit(value)} disabled={disableSubmit}
      />
    </Row>
  </>)

})