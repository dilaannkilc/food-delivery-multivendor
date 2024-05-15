
import { useApptheme } from "@/lib/context/global/theme.context";

import { SafeAreaView } from "react-native";

import EarningsMain from "../../screen-components/earnings/view/main";

export default function EarningsScreen() {

  const { appTheme } = useApptheme();
  return (
    <SafeAreaView style={{ backgroundColor: appTheme.screenBackground }}>
      <EarningsMain />
    </SafeAreaView>
  );
}
