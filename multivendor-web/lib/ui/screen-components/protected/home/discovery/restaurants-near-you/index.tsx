"use client"
import SliderCard from "@/lib/ui/useable-components/slider-card";


import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useTranslations } from "next-intl";

function RestaurantsNearYou({data,loading,error}) {
  const t = useTranslations();


  if (loading) {
    return <SliderSkeleton/>;
  }

  if (error) {
    return;
  }
  return (
    <SliderCard
    heading={t("generic_listing_heading")}
    title={"restaurants-near-you"}
      data={data || []}
    />
  );
}

export default RestaurantsNearYou;
