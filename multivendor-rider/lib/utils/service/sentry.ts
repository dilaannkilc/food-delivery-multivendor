import * as Sentry from "@sentry/react-native";

export const initSentry = () => {
  console.log("Initializing Sentry");

  Sentry.init({
    dsn: "https://9303b1d33deae903abe4e00ea9f25467@o4507787652694016.ingest.us.sentry.io/4508759522017280",
    environment: "development",
    debug: false,

    tracesSampleRate: 0.3, 
  });
};
