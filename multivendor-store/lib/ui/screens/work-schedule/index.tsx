
import { SafeAreaView } from "react-native";

import { useApptheme } from "@/lib/context/theme.context";
import WorkScheduleMain from "../../screen-components/work-schedule/view/main";

export default function WorkScheduleScreen() {

  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      className="flex-1 h-full w-full"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <WorkScheduleMain />
    </SafeAreaView>
  );
}
