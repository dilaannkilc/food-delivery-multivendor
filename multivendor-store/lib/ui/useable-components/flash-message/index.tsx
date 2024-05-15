import { Colors } from "@/lib/utils/constants";
import { IFlashMessageComponentProps } from "@/lib/utils/interfaces/flash-message.interface";
import { showMessage } from "react-native-flash-message";

export default function FlashMessageComponent(
  props: IFlashMessageComponentProps
) {
  showMessage({
    message: props.message,
    backgroundColor: Colors.light.primary,
    position: "top",
    style: {
      borderRadius: 40,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 30,
      minHeight: 40, 
      paddingVertical: 10, 
    },
    titleStyle: {
      color: Colors.light.fontMainColor,
      fontSize: 14, 
      textAlign: "center",
    },
    floating: true, 
  });















}
