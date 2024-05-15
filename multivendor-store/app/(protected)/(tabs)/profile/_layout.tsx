
import { useApptheme } from "@/lib/context/theme.context";

import { Stack } from "expo-router";

export default function ProfileLayout() {

  const { appTheme } = useApptheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: appTheme.screenBackground,
        },
        headerTitleStyle: {
          color: appTheme.fontMainColor,
        },
        headerShown: false,
        headerBackButtonMenuEnabled: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
