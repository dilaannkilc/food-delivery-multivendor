
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import setupApollo from "@/lib/apollo";
import PublicAccessTokenService from "@/lib/services/public-access-token.service";

import { AuthProvider } from "@/lib/context/global/auth.context";
import { ConfigurationProvider } from "@/lib/context/global/configuration.context";
import { ApolloProvider } from "@apollo/client";

import { useEffect, useState } from "react";

import "@/i18next";

import "../global.css";

import { UserProvider } from "@/lib/context/global/user.context";
import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";
import FlashMessage from "react-native-flash-message";

import InternetProvider from "@/lib/context/global/internet-provider";

import AppThemeProvidor, { useApptheme } from "@/lib/context/theme.context";
import AnimatedSplashScreen from "@/lib/ui/useable-components/splash/AnimatedSplashScreen";
import UnavailableStatus from "@/lib/ui/useable-components/unavailable-status";


import { Slot } from "expo-router";

SplashScreen.preventAutoHideAsync();





function RootLayout() {

  useKeepAwake();
  const { currentTheme, appTheme } = useApptheme();
  const [loaded] = useFonts({
    SpaceMono: require("../lib/assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("../lib/assets/fonts/Inter.ttf"),
  });

  const [isTokenReady, setIsTokenReady] = useState(false);
  
  const client = setupApollo();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log("🔄 Initializing public access token...");
    PublicAccessTokenService.initialize(client)
      .then(() => {
        console.log("✅ Public access token initialized");
        setIsTokenReady(true);
      })
      .catch((error) => {
        console.error("❌ Failed to initialize token:", error);
        setIsTokenReady(true);
      });
  }, [client]);

  if (!isTokenReady) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <AppThemeProvidor>
        <AnimatedSplashScreen>
          <InternetProvider>
            <ConfigurationProvider>
              <AuthProvider client={client}>
                <StatusBar
                  style={currentTheme ?? "dark"}
                  backgroundColor={appTheme.themeBackground ?? ""}
                />
                <UserProvider>
                  <UnavailableStatus />
                  <Slot />
                </UserProvider>
              </AuthProvider>
            </ConfigurationProvider>
          </InternetProvider>
        </AnimatedSplashScreen>
        <FlashMessage position="center" />
      </AppThemeProvidor>
    </ApolloProvider>
  );
}

export default RootLayout;
