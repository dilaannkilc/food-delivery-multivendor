"use client";

import React, { createContext, useContext, useEffect } from "react";

import { useJsApiLoader } from "@react-google-maps/api";


import {
  IGoogleMapsContext,
  IGoogleMapsProviderProps,
} from "../../utils/interfaces";

import { ToastContext } from "@/lib/context/global/toast.context";

export const GoogleMapsContext = createContext<IGoogleMapsContext>(
  {} as IGoogleMapsContext
);

export const GoogleMapsProvider: React.FC<IGoogleMapsProviderProps> = ({
  apiKey,
  libraries,
  children,
}) => {
  const { showToast } = useContext(ToastContext);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  useEffect(() => {
    const loadGoogleMapsScript = (key: string) => {
      return new Promise<void>((resolve, reject) => {
        if (typeof google === "undefined") {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        } else {
          resolve(); 
        }
      });
    };

    const unloadGoogleMapsScript = () => {
      const script = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };

    if (apiKey) {
      unloadGoogleMapsScript(); 
      loadGoogleMapsScript(apiKey)
        .then(() => {})
        .catch((err) => {
          console.log(err);
          showToast({
            type: "error",
            title: "Google Maps",
            message: "Failed to load Google Maps script.",
          });
        });
    }
  }, [apiKey]);

  const value: IGoogleMapsContext = {
    isLoaded,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
