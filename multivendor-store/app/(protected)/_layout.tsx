
import RestaurantProvider from "@/lib/context/global/restaurant";
import { SoundProvider } from "@/lib/context/global/sound.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { useApptheme } from "@/lib/context/theme.context";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";

import { Stack } from "expo-router";
import { StatusBar, StatusBarStyle } from "expo-status-bar";

import FlashMessage from "react-native-flash-message";

export default function ProtectedLayout() {
  const { appTheme, currentTheme } = useApptheme();

  return (
    <RestaurantProvider.Provider>
      <SoundProvider>
        <>
          <Stack
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: appTheme.screenBackground,
              },
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="order-detail"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
          </Stack>
          {}
          <StatusBar style={currentTheme as StatusBarStyle} />
          <FlashMessage position="bottom" />
        </>
      </SoundProvider>
    </RestaurantProvider.Provider>
  );
}
