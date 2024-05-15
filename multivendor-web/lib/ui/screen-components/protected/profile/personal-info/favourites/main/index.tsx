"use client";

import type React from "react";
import { useRouter } from "next/navigation";


import { useQuery } from "@apollo/client";
import { GET_USER_FAVOURITE } from "@/lib/api/graphql";

import { IUserFavouriteQueryResponse } from "@/lib/utils/interfaces/favourite.restaurants.interface";

import FavouriteCardsGrid from "@/lib/ui/useable-components/favourite-cards-grid";
import CardSkeletonGrid from "@/lib/ui/useable-components/card-skelton-grid";
import HeaderFavourite from "../header";
import FavoritesEmptyState from "@/lib/ui/useable-components/favorites-empty-state";

import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";
import { useTranslations } from "next-intl";

const FavouriteProducts = () => {
  const router= useRouter()
  const t = useTranslations()

  const {
    data: FavouriteRestaurantsData,
    loading: isFavouriteRestaurantsLoading,
  } = useQuery<IUserFavouriteQueryResponse>(GET_USER_FAVOURITE, {
    variables: {}, 
    fetchPolicy: "network-only",
  });


  const handleSeeAllClick = useDebounceFunction(() => {

    router.push("/see-all/favourites");
  }, 500);

  const handleClickFavRestaurant = useDebounceFunction(
    (FavRestaurantId: string | undefined, shopType: string | undefined, slug: string | undefined) => {
      router.push( `/${shopType === "restaurant" ? "restaurant" : "store"}/${slug}/${FavRestaurantId}`);
    },
    500 
  );

  return (
    <div className="w-full py-6 flex flex-col gap-6">
      <HeaderFavourite
        title={t('your_fav')}
        onSeeAllClick={handleSeeAllClick}
      />
      {isFavouriteRestaurantsLoading ? (
        <CardSkeletonGrid count={4} />
      ) : FavouriteRestaurantsData?.userFavourite && FavouriteRestaurantsData.userFavourite.length > 0 ? (
        <FavouriteCardsGrid items={FavouriteRestaurantsData.userFavourite}
        handleClickFavRestaurant={handleClickFavRestaurant}
        />
      ) : (
        <FavoritesEmptyState/>
      )}
    </div>
  );
};

export default FavouriteProducts;
