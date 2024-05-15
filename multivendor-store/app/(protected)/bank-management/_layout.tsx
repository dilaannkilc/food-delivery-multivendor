import { useApptheme } from "@/lib/context/theme.context";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Layout() {

  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerTintColor: appTheme.fontMainColor,
        headerTitleStyle: { color: appTheme.fontMainColor },
        headerStyle: { backgroundColor: appTheme.themeBackground },
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index" 
        options={{
          title: t("Bank Management"),
        }}
      />
    </Stack>
  );
}
