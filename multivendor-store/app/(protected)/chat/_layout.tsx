import { useApptheme } from "@/lib/context/theme.context";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

export default function LoginLayour() {

  const { t } = useTranslation();
  const { appTheme } = useApptheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: Platform.select({
          ios: {
            position: "absolute",
          },

          default: {
            position: "absolute",
            backgroundColor: appTheme.themeBackground,
            elevation: 0, 
            shadowColor: appTheme.themeBackground, 
            shadowOpacity: 0,
            shadowRadius: 0,
          },
        }),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: t("Chat"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
