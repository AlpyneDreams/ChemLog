### Native Modules
These modules can't be used with Expo and requires the [bare workflow](https://docs.expo.dev/introduction/managed-vs-bare/).

- [react-native-navigation-bar-color](https://www.npmjs.com/package/react-native-navigation-bar-color)
  - Is translucent mode at all supported on modern android gesture navbar? (Like on the launcher)
  - Alternatively: [react-native-system-navigation-bar](https://www.npmjs.com/package/react-native-system-navigation-bar)

- [react-native-haptic-feedback](https://www.npmjs.com/package/react-native-haptic-feedback)


#### Security
- expo-secure-store and maybe expo-local-authentication

- [react-native-encrypted-storage](https://www.npmjs.com/package/react-native-encrypted-storage)
  - Probably better to just use expo-secure-store
- [react-native-biometrics](https://www.npmjs.com/package/react-native-biometrics)
  - Would allow encrypting with biometric keys
- [react-native-sensitive-info](https://mcodex.dev/react-native-sensitive-info/)
  - Possibly even better option for biometrics + encryption
