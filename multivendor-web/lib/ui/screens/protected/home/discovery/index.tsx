"use client";
import {
  DiscoveryBannerSection,
  RestaurantsNearYou,
  MostOrderedRestaurants,
  GroceryList,
  TopGroceryPicks,
  TopRatedVendors,
  PopularRestaurants,
  PopularStores,
  OrderItAgain,
  CommingSoonScreen,
} from "@/lib/ui/screen-components/protected/home";

import CuisinesSection from "@/lib/ui/useable-components/cuisines-section";

import useGetCuisines from "@/lib/hooks/useGetCuisines";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";
import ShopTypes from "@/lib/ui/screen-components/protected/home/discovery/shop-types";

export default function DiscoveryScreen() {
  const { restaurantCuisinesData, groceryCuisinesData, queryData:cuisinesQueryData, error, loading } =
    useGetCuisines();

  const {
    queryData,
    loading: mostOrderedLoading,
    error: mostorderedError,
  } = useMostOrderedRestaurants(true, 1, 6);

  const {
    loading: restaurantsLoading,
    queryData: restaurantsNearYou,
    restaurantsData,
    groceriesData,
    error: restaurantsError,
  } = useNearByRestaurantsPreview(true, 1, 6);














































  if (
    restaurantsData.length === 0 &&
    groceriesData.length === 0 &&
    restaurantsNearYou.length === 0 &&
    queryData.length === 0 &&
    cuisinesQueryData?.length === 0 &&
    !loading &&
    !restaurantsLoading
  ) {
    return <CommingSoonScreen />;
  }

  return (
    <>
      <DiscoveryBannerSection />
      <OrderItAgain />
      <ShopTypes />
      <MostOrderedRestaurants
        data={queryData}
        loading={mostOrderedLoading}
        error={!!mostorderedError}
      />
      <CuisinesSection
        title="Restaurant-cuisines"
        data={restaurantCuisinesData}
        loading={loading}
        error={!!error}
      />
      <RestaurantsNearYou
        data={restaurantsNearYou}
        loading={restaurantsLoading}
        error={!!restaurantsError}
      />
      <CuisinesSection
        title="Grocery-cuisines"
        data={groceryCuisinesData}
        loading={loading}
        error={!!error}
      />
      <GroceryList
        data={groceriesData}
        loading={restaurantsLoading}
        error={!!restaurantsError}
      />
      <TopGroceryPicks



      />
      <TopRatedVendors />
      <PopularRestaurants />
      <PopularStores />
    </>
  );
}
