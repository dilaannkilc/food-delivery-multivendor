
import { SoundProvider } from "@/lib/context/global/sound.context";
import { UserProvider } from "@/lib/context/global/user.context";

import { Stack } from "expo-router";
export default function UnProtectedLayout() {
  return (
    <UserProvider>
      <SoundProvider>
        <>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}
          >
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack>
        </>
      </SoundProvider>
    </UserProvider>
  );
}
