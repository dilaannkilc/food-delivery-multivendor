
import { BackHandler, Alert } from 'react-native'

const handleAndroidBackButton = callback => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    callback()
    return true
  })
}

const removeAndroidBackButtonHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress')
}
const exitAlert = () => {
  Alert.alert('Confirm exit', 'Do you want to quit the app?', [
    { text: 'CANCEL', style: 'cancel' },
    {
      text: 'OK',
      onPress: () => {
        BackHandler.exitApp()
      }
    }
  ])
  return true
}

export { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert }
