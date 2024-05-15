

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Href, router } from "expo-router";

import { AuthContext } from "../context/global/auth.context";

import {
  DEFAULT_RIDER_CREDS,
  RIDER_LOGIN,
} from "../api/graphql/mutation/login";

import { FlashMessageComponent } from "../ui/useable-components";

import { IRiderDefaultCredsResponse, IRiderLoginCompleteResponse, IRiderLoginResponse } from "../utils/interfaces/auth.interface";

import { ROUTES } from "../utils/constants";

import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { setItem } from "../services/async-storage";
import { getNotificationToken } from "../utils/methods/permission";

const useLogin = () => {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation();

  const { setTokenAsync } = useContext(AuthContext);

  const [login] = useMutation(RIDER_LOGIN, {
    onCompleted: onLoginCompleted,
    onError,
  });

  useQuery(DEFAULT_RIDER_CREDS, { onCompleted: onDefaultCredsCompleted });


async function onLoginCompleted({ riderLogin }: { riderLogin: IRiderLoginResponse }) {
  setIsLoading(false);
  if (riderLogin) {
    console.log("riderLogin", riderLogin);
    await setItem("rider-id", riderLogin.userId);
    await setTokenAsync(riderLogin.token);
    router.replace(ROUTES.home as Href);
  } 
}

function onDefaultCredsCompleted({ lastOrderCreds }: { lastOrderCreds: IRiderDefaultCredsResponse }) {
  if (lastOrderCreds?.riderUsername && lastOrderCreds?.riderPassword) {
    console.log("lastOrderCreds", lastOrderCreds);
    setCreds({
      username: lastOrderCreds.riderUsername,
      password: lastOrderCreds.riderPassword,
    });
  }
}

  function onError(err: ApolloError) {
    const error = err as ApolloError;
    setIsLoading(false);
    FlashMessageComponent({
      message:
        error?.graphQLErrors[0]?.message ??
        error?.networkError?.message ??
        t("Something went wrong"),
    });
  }
  
  const onLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      const notificationToken = await getNotificationToken();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await login({
        variables: {
          username: username.toLowerCase(),
          password,
          notificationToken,
          timeZone,
        },
      });
    } catch (err) {
      const error = err as ApolloError;
      console.log("Login error:", error);
      FlashMessageComponent({ message: error.message || "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    creds,
    onLogin,
    isLogging: isLoading,
  };
};
export default useLogin;
