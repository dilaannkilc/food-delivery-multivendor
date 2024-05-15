"use client";
import SliderCard from "@/lib/ui/useable-components/slider-card";


import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";

function GroceryList({data,loading,error}) {


  if (loading) {
    return <SliderSkeleton />;
  }

  if (error) {
    return;
  }

  return (
    <SliderCard
      title="Grocery list"
      data={data || []}
      heading="grocerylist"
    />
  );
}

export default GroceryList;
