"use client";

import { ApolloProvider } from "@apollo/client";

import { PrimeReactProvider } from "primereact/api";

import { ToastProvider } from "@/lib/context/global/toast.context";



import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./global.css";

import AuthProvider from "@/lib/context/auth/auth.context";
import { ConfigurationProvider } from "@/lib/context/configuration/configuration.context";
import { useSetupApollo } from "@/lib/hooks/useSetApollo";
import { UserProvider } from "@/lib/context/User/User.context";

import AppLayout from "@/lib/ui/layouts/global";
import { FontawesomeConfig } from "@/lib/config";
import { LocationProvider } from "@/lib/context/Location/Location.context";
import { UserAddressProvider } from "@/lib/context/address/address.context";
import { SearchUIProvider } from "@/lib/context/search/search.context";
import NotificationInitializer from "../NotificationInitialzer";
import FirebaseForegroundHandler from "@/lib/config/FirebaseForegroundHandler";
import { useEffect,useRef } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const client = useSetupApollo();

  const value = {
    ripple: true,
  };



































  const hasRegistered = useRef(false); 
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        if (hasRegistered.current) return; 
        hasRegistered.current = true;

        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("✅ Service Worker registered:", registration.scope);
            return registration.update()
          })
          .catch((error) => {
            console.error("❌ SW registration failed:", error);
          });
      });
    }
  }, []);











  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <FontawesomeConfig />
      </head>
      <body className={"flex flex-col flex-wrap"}>
        <PrimeReactProvider value={value}>
          <ApolloProvider client={client}>
            <ConfigurationProvider>
              <ToastProvider>
                <AuthProvider>
                  <UserProvider>
                    <LocationProvider>
                      <UserAddressProvider>
                        <SearchUIProvider>
                          <AppLayout>
                            <NotificationInitializer/>
                            <FirebaseForegroundHandler/>
                            {children}
                            </AppLayout>
                        </SearchUIProvider>
                      </UserAddressProvider>
                    </LocationProvider>
                  </UserProvider>
                </AuthProvider>
              </ToastProvider>
            </ConfigurationProvider>
          </ApolloProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
