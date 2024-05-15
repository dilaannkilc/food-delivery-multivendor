
"use client"
import CuisinesSliderCard from "@/lib/ui/useable-components/cuisines-slider-card";

import CuisinesSliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/cuisines.slider.skeleton";

import useTopRatedVendors from "@/lib/hooks/useTopRatedVendors";

function TopRatedVendors() {
  const { queryData, error, loading } = useTopRatedVendors();
  if (error) {
    return;
  }
  if (loading) {
    return <CuisinesSliderSkeleton />;
  }
  return (
    <CuisinesSliderCard
      title="Our-brands"
      data={queryData || []}
      showLogo={true}
      cuisines={false}
    />
    
  );
}
export default TopRatedVendors;
