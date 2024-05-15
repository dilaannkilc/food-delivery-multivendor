
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "@/lib/ui/screen-components/chat/header";
import ChatMain from "@/lib/ui/screen-components/chat/main";

import { useApptheme } from "@/lib/context/global/theme.context";

export default function Chat() {

  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      className="flex-1  gap-y-3"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <ChatHeader />
      <ChatMain />
    </SafeAreaView>
  );
}
