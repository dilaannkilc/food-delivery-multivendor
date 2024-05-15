
import { Image, Text, View } from "react-native";
import Modal from "react-native-modal";

import { IWellDoneComponentProps } from "@/lib/utils/interfaces";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function WelldoneComponent({
  orderId = "",
  status = "Delivered",
  setOrderId,
}: IWellDoneComponentProps) {

  useEffect(() => {
    setTimeout(() => {
      setOrderId("");
    }, 3000);
  }, [orderId]);

  const { t } = useTranslation();
  return (
    <Modal
      isVisible={!!orderId}
      onBackdropPress={() => setOrderId("")}
      onBackButtonPress={() => setOrderId("")}
      collapsable={true}
      coverScreen={false}
    >
      <View className="h-fit w-full bg-transparent items-center">
        <View className="h-[120px] w-[95%] items-center justify-around bg-white border-white rounded-[16px]">
          {}
          {}
          <Image
            source={require("../../../assets/images/welldone.png")}
            className="h-[40px] w-[40px]"
          />

          {}
          <View className="items-center">
            <Text className="font-inter text-lg font-bold text-centertext-gray-900">
              {t("Well Done Rider")}
            </Text>
            <Text className="font-inter text-sm font-normal leading-[22px] text-center">
              {t("Order Number")} #{orderId.substring(0, 5)} {status}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
