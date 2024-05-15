"use client";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import React, { useState, useCallback, useEffect, useRef } from "react";

import HomeIcon from "../../../../../assets/home_icon.png";
import RestIcon from "../../../../../assets/rest_icon.png";
import Image from "next/image";
import TrackingRider from "./trackingRider";
import { useTranslations } from "next-intl";
import { darkMapStyle } from "@/lib/utils/mapStyles/mapStyle";
import { useTheme } from "@/lib/providers/ThemeProvider";

interface IGoogleMapTrackingComponent {
  isLoaded: boolean;
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  directions: google.maps.DirectionsResult | null;
  directionsCallback: (
    result: google.maps.DirectionsResult | null,
    status: string
  ) => void;
  orderStatus: string;
  riderId?: string;
  isCheckingCache?: boolean;

}

function GoogleMapTrackingComponent({
  isLoaded,
  origin,
  destination,
  directions,
  isCheckingCache,
  directionsCallback,
  orderStatus,
  riderId,

}: IGoogleMapTrackingComponent) {

  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [riderDirections, setRiderDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [needsRiderDirections, setNeedsRiderDirections] = useState(false);
  const prevOrderStatusRef = useRef<string>(orderStatus);

  const DIRECTIONS_DEBOUNCE_INTERVAL = 30000; 
  const lastDirectionsRequestTimeRef = useRef<number>(0);

  const showRestaurantMarker = ["PENDING", "ACCEPTED", "ASSIGNED"].includes(
    orderStatus
  );
  const t = useTranslations();
  const showRiderMarker = ["PICKED", "ASSIGNED"].includes(orderStatus);
  const { theme } = useTheme();

  useEffect(() => {
    if (prevOrderStatusRef.current !== orderStatus && orderStatus === "PICKED") {

      setRiderDirections(null);
      setNeedsRiderDirections(true);
      lastDirectionsRequestTimeRef.current = Date.now(); 
    }
    prevOrderStatusRef.current = orderStatus;
  }, [orderStatus]);

  const onRiderLocationUpdate = useCallback((location: { lat: number; lng: number }) => {
    setRiderLocation(location);

    if (orderStatus === "PICKED") {
      const now = Date.now();
      const timeSinceLastRequest = now - lastDirectionsRequestTimeRef.current;

      if (timeSinceLastRequest >= DIRECTIONS_DEBOUNCE_INTERVAL) {
        setNeedsRiderDirections(true);
        lastDirectionsRequestTimeRef.current = now;
      }
    }
  }, [orderStatus]);

  const riderDirectionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: string) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        setRiderDirections(result);
        setNeedsRiderDirections(false);
      }
    },
    []
  );

  const mapOrigin = showRiderMarker ? riderLocation : origin;
  const mapDestination = destination;
  const mapCenter = showRiderMarker && riderLocation ? riderLocation : (showRiderMarker ? destination : origin);

  const activeDirections = showRiderMarker ? riderDirections : directions;
  const shouldRequestRiderDirections = showRiderMarker && needsRiderDirections && riderLocation && !riderDirections;

  return (
    <div className="relative">
      {isLoaded ? (
        <GoogleMap
          options={{
            styles: theme === "dark" ? darkMapStyle : null,
            disableDefaultUI: true,
          }}
          mapContainerStyle={{
            width: "100%",
            height: "400px",
          }}
          center={mapCenter}
          zoom={13}
        >
          {}
          {showRestaurantMarker && origin && (
            <Marker
              position={origin}
              icon={{
                url: RestIcon.src,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}

          {}
          <Marker
            position={mapDestination}
            icon={{
              url: HomeIcon.src,
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />

          {}
          {showRiderMarker && riderId && (
            <TrackingRider
              id={riderId}
              onLocationUpdate={onRiderLocationUpdate}
            />
          )}

          {}
          {!showRiderMarker && !directions && !isCheckingCache && mapOrigin && (
            <DirectionsService
              options={{
                destination: mapDestination,
                origin: mapOrigin,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />
          )}

          {}
          {shouldRequestRiderDirections && riderLocation && (
            <DirectionsService
              options={{
                destination: mapDestination,
                origin: riderLocation,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={riderDirectionsCallback}
            />
          )}

          {activeDirections && (
            <DirectionsRenderer
              directions={activeDirections}
              options={{
                directions: activeDirections,
                suppressMarkers: true, 
                polylineOptions: {
                  strokeColor: "#5AC12F",
                  strokeOpacity: 0.8,
                  strokeWeight: 3,
                  zIndex: 10,
                },
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <>
          <Image
            alt={t("map_showing_delivery_route_alt")}
            className="w-full h-64 object-cover"
            height="300"
            src="https://storage.googleapis.com/a1aa/image/jt1AynRJJVtM9j1LRb30CodA1xsK2R23pWTOmRv3nsM.jpg"
            width="1200"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-color text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
            H
          </div>{" "}
        </>
      )}
    </div>
  );
}

export default GoogleMapTrackingComponent;
