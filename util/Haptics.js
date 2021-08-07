import { Vibration } from "react-native"

// Placeholders for native haptics stuff (see react-native-haptic-feedback)
export default {
  longPress() {
    Vibration.vibrate(1)
  }
}