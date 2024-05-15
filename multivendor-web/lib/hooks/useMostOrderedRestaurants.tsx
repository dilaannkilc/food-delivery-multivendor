
import { MOST_ORDER_RESTAURANTS } from "@/lib/api/graphql/queries";

import { useQuery } from "@apollo/client";

import {
  IMostOrderedRestaurantsData,
  IRestaurant,
} from "../utils/interfaces/restaurants.interface";

import { useUserAddress } from "../context/address/address.context";
import { toFloatIfNeeded } from "../utils/methods/helpers";

const useMostOrderedRestaurants = (enabled = true, page = 1, limit=10, shopType?: "restaurant" | "grocery" | null ) => {
  const { userAddress } = useUserAddress();
  const userLongitude = userAddress?.location?.coordinates[0] || 0;
  const userLatitude = userAddress?.location?.coordinates[1] || 0;

  const { data, loading, error, networkStatus, fetchMore } =
    useQuery<IMostOrderedRestaurantsData>(MOST_ORDER_RESTAURANTS, {
      variables: {
        latitude: toFloatIfNeeded(userLatitude),
        longitude: toFloatIfNeeded(userLongitude),
        page,
        limit,
        shopType: shopType ?? null,
      },
      fetchPolicy: "cache-and-network",
      skip: !enabled,
      notifyOnNetworkStatusChange: true, 
    });

  let queryData = data?.mostOrderedRestaurantsPreview || [];

  let restaurantsData: IRestaurant[] =
    queryData?.filter((item) => item?.shopType.toLowerCase() === "restaurant") ||
    [];

  let groceriesData: IRestaurant[] =
    queryData?.filter((item) => item?.shopType.toLowerCase() === "grocery") ||
    [];
    console.log("groceriesData in hook", groceriesData);
  return {
    queryData,
    loading,
    error,
    networkStatus,
    restaurantsData,
    groceriesData,
    fetchMore, 
  };
};

export default useMostOrderedRestaurants;
