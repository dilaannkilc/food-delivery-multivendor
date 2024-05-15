
import EarningsOrderDetailsMain from "@/lib/ui/screen-components/earning-order-details/view";

import { SafeAreaView } from "react-native";

import { useApptheme } from "@/lib/context/theme.context";

export default function EarningsOrderDetailsScreen() {

  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <EarningsOrderDetailsMain />
    </SafeAreaView>
  );
}
