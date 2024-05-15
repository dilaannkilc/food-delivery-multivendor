"use client";

import { createContext, useCallback, useEffect, useState } from "react";

import {
  IConfiguration,
  IConfigurationProviderProps,
  ILazyQueryResult,
} from "@/lib/utils/interfaces";

import { GET_CONFIGURATION } from "@/lib/api/graphql";

import { useLazyQueryQL } from "@/lib/hooks/useLazyQueryQL";

export const ConfigurationContext = createContext<IConfiguration | undefined>({
  _id: "",
  currency: "",
  currencySymbol: "",
  restaurantAppSentryUrl: "",
});

export const ConfigurationProvider: React.FC<IConfigurationProviderProps> = ({
  children,
}) => {
  const [configuration, setConfiguration] = useState<
    IConfiguration | undefined
  >();

  const { fetch, loading, error, data } = useLazyQueryQL(GET_CONFIGURATION, {
    debounceMs: 300,
  }) as ILazyQueryResult<
    { configuration: IConfiguration } | undefined,
    undefined
  >;

  const onFetchConfiguration = () => {
    const configuration: IConfiguration | undefined =
      loading || error || !data
        ? {
            _id: "",
            restaurantAppSentryUrl: "",
            currency: "",
            currencySymbol: "",
          }
        : data?.configuration;

    setConfiguration(configuration);
  };

  const fetchConfiguration = useCallback(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    fetchConfiguration();
  }, []);

  useEffect(() => {
    onFetchConfiguration();
  }, [data]);

  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
};
