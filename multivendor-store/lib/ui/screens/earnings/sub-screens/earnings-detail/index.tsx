
import { useApptheme } from "@/lib/context/theme.context";
import EarningDetailsMain from "@/lib/ui/screen-components/earning-details/view";

import { IDateFilter } from "@/lib/utils/interfaces/rider-earnings.interface";

import { useState } from "react";

import { SafeAreaView } from "react-native";

export default function EarningsDetailScreen() {

  const { appTheme } = useApptheme();

  const [dateFilter, setDateFilter] = useState<IDateFilter>({
    startDate: "",
    endDate: "",
  });
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <EarningDetailsMain
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
    </SafeAreaView>
  );
}
