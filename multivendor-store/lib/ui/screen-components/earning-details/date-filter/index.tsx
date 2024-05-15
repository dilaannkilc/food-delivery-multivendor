
import { useApptheme } from "@/lib/context/theme.context";
import { CustomContinueButton } from "@/lib/ui/useable-components";
import { Colors } from "@/lib/utils/constants";

import {
  IEarningDetailsMainProps,
  IEarningsDateFilterProps,
} from "@/lib/utils/interfaces/rider-earnings.interface";

import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Text, TouchableOpacity, View } from "react-native";

import { Calendar, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

export default function EarningDetailsDateFilter({
  dateFilter,
  setDateFilter,
  handleFilterSubmit,
  isFiltering,
  isDateFilterVisible,
  setIsDateFilterVisible,
  refetchDeafult,
}: IEarningDetailsMainProps & IEarningsDateFilterProps) {

  const { t } = useTranslation();
  const { appTheme } = useApptheme();

  const handleDayPress = (day: DateData) => {
    const { dateString } = day;

    if (dateFilter.startDate === dateString && !dateFilter.endDate) {
      setDateFilter({ startDate: "", endDate: "" });
      return;
    }

    if (!dateFilter.startDate || (dateFilter.startDate && dateFilter.endDate)) {
      setDateFilter({ startDate: dateString, endDate: "" });
    } else {

      if (new Date(dateString) >= new Date(dateFilter.startDate)) {
        setDateFilter((prev) => ({ ...prev, endDate: dateString }));
      } else {

        setDateFilter({ startDate: dateString, endDate: "" });
      }
    }
  };

  const getMarkedDates = () => {
    const markedDates: MarkedDates = {};

    if (dateFilter.startDate) {
      markedDates[dateFilter.startDate] = {
        startingDay: true,
        marked: true,
        color: Colors.light.primary,
        dotColor: Colors.light.primary,
        selectedColor: Colors.light.primary,
        selectedTextColor: Colors.light.primary,
        textColor: Colors.light.primary,
      };
    }

    if (dateFilter.endDate) {
      markedDates[dateFilter.endDate] = {
        endingDay: true,
        marked: true,
        color: Colors.light.primary,
        dotColor: Colors.light.primary,
        selectedColor: Colors.light.primary,
        selectedTextColor: Colors.light.primary,
        textColor: Colors.light.primary,
      };

      const currentDate = new Date(dateFilter.startDate!);
      const endDate = new Date(dateFilter.endDate);

      while (currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = currentDate.toISOString().split("T")[0];
        if (dateString !== dateFilter.endDate) {
          markedDates[dateString] = {};
        }
      }
    }

    return markedDates;
  };

  const datesBeGetter = getMarkedDates();
  return (
    <View className="p-4">
      <View className="flex flex-row items-center justify-between w-full px-2">
        <TouchableOpacity
          onPress={() => setIsDateFilterVisible((prev) => !prev)}
          className="flex flex-row gap-2 items-center"
        >
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="filter" color={Colors.light.primary} size={25} />
            <Text style={{ color: appTheme.fontMainColor }}>
              {t("Date Filter")}
            </Text>
          </View>
        </TouchableOpacity>
        {(dateFilter.startDate || dateFilter.endDate) && (
          <TouchableOpacity
            onPress={() => {
              setDateFilter({ endDate: "", startDate: "" });
              refetchDeafult({
                startDate: "",
                endDate: "",
              });
            }}
          >
            <View className="flex flex-row items-center gap-2">
              <Ionicons name="remove-sharp" color={"red"} size={25} />
              <Text style={{ color: appTheme.fontSecondColor }}>
                {t("Clear Filters")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {isDateFilterVisible && (
        <View>
          <Calendar
            initialDate={""}
            onDayPress={(day: DateData) => handleDayPress(day)}
            markedDates={{
              ...datesBeGetter,
            }}
          />
          <CustomContinueButton
            onPress={() => handleFilterSubmit()}
            title={isFiltering ? t("Please Wait") : t("Apply Filter")}
            disabled={isFiltering}
          />
        </View>
      )}
    </View>
  );
}
