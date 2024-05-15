
import { ActivityIndicator } from "react-native";

import { ISpinnerComponentProps } from "@/lib/utils/interfaces";

import { useApptheme } from "@/lib/context/global/theme.context";
function SpinnerComponent(props: ISpinnerComponentProps) {

  const { appTheme } = useApptheme();
  return (
    <ActivityIndicator
      size="small"
      color={props.color ? props.color : appTheme.primary}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    />
  );
}

export default SpinnerComponent;
