
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useState } from "react";

import { RIDER_TOKEN } from "@/lib/utils/constants";
import { IAuthContext, IAuthProviderProps } from "@/lib/utils/interfaces";
import { useRouter } from "expo-router";

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);

export const AuthProvider: React.FC<IAuthProviderProps> = ({
  client,
  children,
}) => {

  const router = useRouter();

  const [token, setToken] = useState<string>("");
  const setTokenAsync = async (token: string) => {
    await AsyncStorage.setItem(RIDER_TOKEN, token);
    client.clearStore();
    setToken(token);
  };

  const logout = async () => {
    try {

      await AsyncStorage.multiRemove([RIDER_TOKEN, "rider-id"]);


      try {
        const hasLocationUpdates =
          await Location.hasStartedLocationUpdatesAsync("RIDER_LOCATION");
        if (hasLocationUpdates) {
          await Location.stopLocationUpdatesAsync("RIDER_LOCATION");
        }
      } catch (locationError) {
        console.log("Error stopping location updates:", locationError);
      }

      setToken("");
      router.replace("/login");
    } catch (e) {



      console.log("Logout Error: ", e);
    }
  };

  const values: IAuthContext = {
    token: token ?? "",
    logout,
    setTokenAsync,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
