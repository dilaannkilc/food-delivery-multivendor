import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Layout() {

  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index" 
        options={{
          title: t("Language"),
        }}
      />
    </Stack>
  );
}
