"use client";
import { useEffect, useState, useCallback, useContext } from "react";
import { GoogleMap, Marker, Circle } from "@react-google-maps/api";
import styles from "./google-map-component.module.css";
import { IGoogleMapComponentProps } from "@/lib/utils/interfaces";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { darkMapStyle } from "@/lib/utils/mapStyles/mapStyle";
import { useTheme } from "@/lib/providers/ThemeProvider";

const GoogleMapComponent = ({
  center,
  circleRadius = 300, 
  visible,
}: IGoogleMapComponentProps) => {


  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const [zoom, setZoom] = useState(15);
  const { theme } = useTheme();

  const { isLoaded } = useContext(GoogleMapsContext);


  useEffect(() => {
    if (!visible && mapInstance) {
      setMapInstance(null);
    }
  }, [visible, mapInstance]);

  const mapContainerStyle = {
    width: "100%",
    height: "360px",
    position: "relative" as const,
  };

  const circleOptions = {
    strokeColor: "#000",
    strokeOpacity: 0.5,
    strokeWeight: 1,
    fillColor: "#000",
    fillOpacity: 0.1,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMapInstance(null);
  }, []);


  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      const newZoom = Math.min(zoom + 1, 20); 
      mapInstance.setZoom(newZoom);
      setZoom(newZoom);
    }
  }, [mapInstance, zoom]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      const newZoom = Math.max(zoom - 1, 1); 
      mapInstance.setZoom(newZoom);
      setZoom(newZoom);
    }
  }, [mapInstance, zoom]);

  if (!visible) return null;












  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500"></div>
    );
  }

  return (
    <div className="map-container" style={{ position: "relative" }}>
      {}
      {}
      <GoogleMap
        mapContainerClassName="block dark:hidden"
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: false, 
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          cameraControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "all",
              stylers: [
                { saturation: -30 }, 
              ],
            },
          ],
        }}
      >
        {}
        <Marker position={center} />
        {}
        <Circle center={center} radius={circleRadius} options={circleOptions} />
      </GoogleMap>

      {}

      <GoogleMap
        mapContainerClassName=" hidden dark:block"
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: false, 
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          cameraControl: false,
          styles: theme === "dark" ? darkMapStyle : null,
          disableDefaultUI: true,
        }}
      >
        {}
        <Marker position={center} />
        {}
        <Circle center={center} radius={circleRadius} options={circleOptions} />
      </GoogleMap>

      {}
      <div className={styles.zoomControls}>
        <button
          className={styles.zoomButton}
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          className={styles.zoomButton}
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
