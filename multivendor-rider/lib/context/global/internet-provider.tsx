import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Network from 'expo-network'

import { NoInternetIcon } from "@/lib/ui/useable-components/svg";

interface InternetContextProps {
  isConnected: boolean;
}

const InternetContext = createContext<InternetContextProps | undefined>(
  undefined,
);

export const useInternet = (): InternetContextProps => {


  const context = useContext(InternetContext);
  if (!context) {
    throw new Error("useInternet must be used within an InternetProvider");
  }
  return context;
};

const InternetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean|undefined>(true);

  useEffect(() => {
    const checkConnection = async () => {
      const networkState = await Network.getNetworkStateAsync()
      setIsConnected(networkState.isConnected)
    }

    checkConnection()

    const interval = setInterval(checkConnection, 5000)

    return () => clearInterval(interval) 
  }, [])

  if (!isConnected) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <NoInternetIcon />
        <Text className="font-[Inter] text-black text-2xl font-bold">
          No Internet Connection
        </Text>
      </View>
    );
  }

  return (
    <InternetContext.Provider value={{ isConnected }}>
      {children}
    </InternetContext.Provider>
  );
};

export default InternetProvider;
