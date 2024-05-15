"use client";
import SliderCard from "@/lib/ui/useable-components/slider-card";


import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";

function MostOrderedRestaurants({ data, loading,error }) {


  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }
  return (
    <SliderCard
      heading="most_ordered_restaurants"
      data={data || []}
      title="most-ordered-restaurants"
    />
  );
}

export default MostOrderedRestaurants;
