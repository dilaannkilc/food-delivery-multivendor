
import React, { useCallback, useState } from "react";

import Card from "@/lib/ui/useable-components/card";

import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";

import { useParams } from "next/navigation";

import HomeHeadingSection from "@/lib/ui/useable-components/home-heading-section";

import { IRestaurant } from "@/lib/utils/interfaces/restaurants.interface";

import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";

function CuisineSelectionSection() {
  const params = useParams() as Record<string, string | string[]>;

  const pickParam = (key: string) =>
    Array.isArray(params[key]) ? (params[key] as string[])[0] : (params[key] as string | undefined);

  const rawParam =
    pickParam("category") ?? 
    pickParam("slug") ??     
    pickParam("id") ??       
    "";

  const decoded = decodeURIComponent(rawParam);
  const slugWithSpaces = decoded.replace(/-/g, " ").trim();

  const normalizedSlug = slugWithSpaces.normalize("NFKC").toLocaleLowerCase();

  const title = `${slugWithSpaces} near you`;

  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });

  const { queryData, loading, error } = useNearByRestaurantsPreview(true, 1, 109, null);

  const getCuisinRestaurants = queryData?.filter((item) =>
    item?.cuisines?.some(
      (c) => c?.toString().normalize("NFKC").toLocaleLowerCase() === normalizedSlug
    )
  );

  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        setIsModalOpen({ value, id });
      }
    },
    [isModalOpen]
  );

  if (loading) return <SliderSkeleton />;
  if (error) return null;

  if (!queryData?.length) return <div>No items found</div>;

  return (
    <>
      <HomeHeadingSection title={title} showFilter={false} />
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 items-center">
          {(getCuisinRestaurants as IRestaurant[] | undefined)?.map((item) => (
            <Card
              key={item._id}
              item={item}
              isModalOpen={isModalOpen}
              handleUpdateIsModalOpen={handleUpdateIsModalOpen}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CuisineSelectionSection;
