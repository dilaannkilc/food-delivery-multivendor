import { Alert, Linking } from "react-native";

const formatPhoneNumber = (phone: string): string => {

  return phone.replace(/[^\d+]/g, "");
};




















export const callNumber = async (phoneNumber: string) => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  const url = `tel:${formattedNumber}`;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    Linking.openURL(url);
  } else {
    Alert.alert("Error", "Calling is not supported on this device");
  }
};
