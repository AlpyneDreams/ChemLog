import { Text, TextInput as PaperTextInput, TouchableRipple, useTheme } from "react-native-paper"
import { View, TextInput as NativeTextInput, StyleSheet } from "react-native"
import { Row } from "../Util"
import { useRef } from "react"

export function TextInput({label, value, onChangeText, textColor, style, left, right, ...props}) {
  const {colors} = useTheme()
  const ref = useRef()
  const isFocused = ref.current && ref.current.isFocused()
  return (
    <TouchableRipple
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceVariant,
          borderColor: isFocused ? colors.primary : colors.outline,
          borderBottomWidth: isFocused ? 1 : 0.5,
          ...style
        },
      ]}
      onPress={() => {
        ref.current.focus()
      }}
    >
      <Row style={{alignItems: 'center'}}>
        {left && <View style={{width: 32, marginLeft: 16, justifyContent: 'center'}}>
          {left}
        </View>}
        <View style={{flex: 1, marginLeft: 16}}>
          <Text style={{fontSize: 12, color: isFocused ? colors.primary : colors.outline}}>{label}</Text>
          <Row style={{alignItems: 'center'}}>
            <NativeTextInput
              ref={ref}
              style={{
                fontSize: 16, color: textColor ?? colors.onSurface,
              }}
              value={value} onChangeText={onChangeText}
              {...props}
            />
            {right && <View style={{marginLeft: 'auto', width: 32, height: 32, paddingBottom: 8}}>
              {right}
            </View>}
          </Row>
        </View>
      </Row>
    </TouchableRipple>
  )
}

TextInput.Icon = PaperTextInput.Icon

const styles = StyleSheet.create({
  container: {
    height: 56, padding: 8, paddingTop: 4, paddingHorizontal: 0,
    borderTopLeftRadius: 4, borderTopRightRadius: 4,
    borderBottomWidth: 0.5,
  }
})
