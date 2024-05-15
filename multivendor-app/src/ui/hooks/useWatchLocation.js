



import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useEffect } from 'react'





export const LOCATION_STORAGE_KEY = 'lastKnownLocation'
const LOCATION_UPDATES_DISTANCE = 100 

const useWatchLocation = () => {
  const [permission, requestPermission] = Location.useForegroundPermissions()
  const watchPositionCallback = async ({ coords }) => {
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({ ...coords }))
  }




  useEffect(() => {
    if (permission && !permission.granted) return
    let locationSubscription = null
    ;(async () => {
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: LOCATION_UPDATES_DISTANCE
        },
        watchPositionCallback
      )
    })()
    return () => locationSubscription && locationSubscription.remove()
  }, [permission])

  const onRequestPermission = async () => {
    return await requestPermission()
  }

  return { permission, onRequestPermission }
}

export const getLocationFromStorage = async () => {
  const locationStr = await AsyncStorage.getItem(LOCATION_STORAGE_KEY)
  if (!locationStr) return null
  const location = JSON.parse(locationStr)
  return location
}

export default useWatchLocation
