import * as Print from "expo-print";
import { formatReceipt } from "./format-receipt";

export const printAsync = async (order, printerUrl) => {
  try {
    return await Print.printAsync({
      width: 576, 
      orientation: Print.Orientation.portrait,
      html: formatReceipt(order),
      printerUrl,
    });
  } catch (error) {
    console.log("error", error);
  }
  return null;
};

export const printToFileAsync = async (order) => {
  try {
    return await Print.printToFileAsync({
      width: 576, 
      html: formatReceipt(order),
    });
  } catch (error) {
    console.log("error", error);
  }
  return null;
};

export const selectPrinterAsync = async () => {
  try {
    const { name, url } = await Print.selectPrinterAsync();
    return { name, url };
  } catch (error) {
    console.log("error", error);
  }
  return null;
};
