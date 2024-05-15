import { ActivityIndicator } from "react-native";

import { Colors } from "@/lib/utils/constants";

import { ISpinnerComponentProps } from "@/lib/utils/interfaces";
function SpinnerComponent(props: ISpinnerComponentProps) {
  return (
    <ActivityIndicator
      size="small"
      color={props.color ?? Colors.light.primary}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}

export default SpinnerComponent;
