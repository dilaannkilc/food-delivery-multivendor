import { useState } from "react";

import useGeocoding from "./useGeocoding";
import useToast from "./useToast";

import { useUserAddress } from "../context/address/address.context";

import { LocationNameSpace } from "../utils/types/location";
import { onUseLocalStorage } from "../utils/methods/local-storage";
import { USER_CURRENT_LOCATION_LS_KEY } from "../utils/constants";

export default function useSetUserCurrentLocation() {

  const [isLocationFetching, setIsLocationFetching] = useState(false);

  const { showToast } = useToast();
  const { getAddress } = useGeocoding();
  const { setUserAddress } = useUserAddress();

  const onSetUserLocation: LocationNameSpace.LocationCallback = async (
    error,
    currrent_location
  ) => {
    try {
      setIsLocationFetching(true);
      if (error) {
        setIsLocationFetching(false);
        showToast({
          type: "info",
          title: "Ensure Current location for delivery",
          message: ``,
        });
        return;
      }
      if (!currrent_location) {
        setIsLocationFetching(false);
        showToast({
          type: "info",
          title: "Ensure Current location for delivery",
          message: ``,
        });
        return;
      }

      const { formattedAddress } = await getAddress(
        currrent_location.latitude,
        currrent_location.longitude
      );

      let address = formattedAddress || "Unknown Address";




      if (error) {
        showToast({
          type: "error",
          title: "Current Location",
          message: `Error fetching current location - ${error}`,
        });

        setIsLocationFetching(false);
      } else {
        setIsLocationFetching(false);
        onUseLocalStorage(
          "save",
          USER_CURRENT_LOCATION_LS_KEY,
          JSON.stringify({
            label: "Home",
            location: {
              coordinates: [
                currrent_location.longitude,
                currrent_location.latitude,
              ],
            },
            _id: "",

            deliveryAddress: address,
          })
        );
        setUserAddress({
          label: "Home",
          location: {
            coordinates: [
              currrent_location.longitude,
              currrent_location.latitude,
            ],
          },
          _id: "",

          deliveryAddress: address,
        });
      }
    } catch (fetchError) {
      setIsLocationFetching(false);
      console.error("Error fetching address using Google Maps API");
    }
  };

  return { onSetUserLocation, isLocationFetching };
}
