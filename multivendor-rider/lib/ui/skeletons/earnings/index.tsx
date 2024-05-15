
import { MotiView } from "moti";

import EarningHeadingSkeleton from "./earning-heading";
import EarningStackSkeleton from "./earning-stack";
import EarningTopChartSkeleton from "./earning-top-chart";

import { useApptheme } from "@/lib/context/global/theme.context";

export default function EarningScreenMainLoading() {

  const { appTheme } = useApptheme();
  return (
    <MotiView
      className="flex flex-col justify-between items-center"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <EarningTopChartSkeleton />
      <EarningHeadingSkeleton />
      <MotiView>
        {[...Array(5)].map((_, index) => (
          <EarningStackSkeleton key={index} />
        ))}
      </MotiView>
    </MotiView>
  );
}
