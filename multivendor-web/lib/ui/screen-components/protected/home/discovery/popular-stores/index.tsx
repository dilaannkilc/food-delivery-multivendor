"use client"
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";

import useMostOrderedRestaurants from "@/lib/hooks/useMostOrderedRestaurants";

import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";

function PopularStores() {
  const { error, loading, queryData } = useMostOrderedRestaurants(true,1,5,"grocery");

  if (loading) {
    return <CuisinesSliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <CuisinesSliderCard
      title="Popular-stores"
      data={queryData || []}
      showLogo={true}
      last={true}
      cuisines={false}
    />
  );
}

export default PopularStores;
