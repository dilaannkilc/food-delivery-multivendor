import { Tabs, usePathname } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/lib/ui/useable-components/HapticTab";
import {
  CurrencyIcon,
  HomeIcon,
  PersonIcon,
  WalletIcon,
} from "@/lib/ui/useable-components/svg";

import { useApptheme } from "@/lib/context/global/theme.context";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RootLayout = () => {

  const [tabKey, setTabKey] = useState(1);

  const pathName = usePathname();
  const { t } = useTranslation();
  const { appTheme } = useApptheme();

  useEffect(() => {
    if (pathName.startsWith("/wallet/success")) {
      setTabKey((prev) => prev + 1); 
    }
  }, [pathName]);

  return (
    <Tabs
      key={tabKey}
      screenOptions={{
        tabBarActiveTintColor: appTheme.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "#1F2937",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0.5, 
            shadowColor: "#000", 
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,

          },
          android: {
            position: "absolute",
            backgroundColor: "#1F2937",


            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0.5, 
            elevation: 5, 
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          href: "/(tabs)/home/orders",

          title: t("Home"),
          tabBarIcon: ({ color }) => (

            <HomeIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t("Wallet"),
          tabBarIcon: ({ color }) => (
            <WalletIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: t("Earnings"),
          tabBarIcon: ({ color }) => (
            <CurrencyIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("Profile"),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <PersonIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
