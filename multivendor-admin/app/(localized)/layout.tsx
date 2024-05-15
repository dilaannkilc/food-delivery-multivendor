'use client';

import { ApolloProvider } from '@apollo/client';

import { PrimeReactProvider } from 'primereact/api';

import { LayoutProvider } from '@/lib/context/global/layout.context';
import { SidebarProvider } from '@/lib/context/global/sidebar.context';
import { UserProvider } from '@/lib/context/global/user-context';

import { ConfigurationProvider } from '@/lib/context/global/configuration.context';
import { ToastProvider } from '@/lib/context/global/toast.context';

import { FontawesomeConfig } from '@/lib/config';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import './global.css';

import { useSetupApollo } from '@/lib/hooks/useSetApollo';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const client = useSetupApollo();

  const value = {
    ripple: true,
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <FontawesomeConfig />
      </head>
      <body className={'flex flex-col flex-wrap'}>
        <PrimeReactProvider value={value}>
          <ApolloProvider client={client}>
            <ConfigurationProvider>
              <LayoutProvider>
                <UserProvider>
                  <SidebarProvider>
                    <ToastProvider>{children}</ToastProvider>
                  </SidebarProvider>
                </UserProvider>
              </LayoutProvider>
            </ConfigurationProvider>
          </ApolloProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
