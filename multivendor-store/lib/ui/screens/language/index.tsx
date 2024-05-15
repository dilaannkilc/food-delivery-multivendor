
import { SafeAreaView } from "react-native";

import { useApptheme } from "@/lib/context/theme.context";
import LanguageMain from "../../screen-components/home/language/view/main";

const index = () => {

  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <LanguageMain />
    </SafeAreaView>
  );
};

export default index;
