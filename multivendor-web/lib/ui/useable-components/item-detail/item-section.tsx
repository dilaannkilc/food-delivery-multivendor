
import { SectionProps, Option } from "@/lib/utils/interfaces";
import { useTranslations } from "next-intl";
import { useConfig } from "@/lib/context/configuration/configuration.context";



export const ItemDetailSection = <
  T extends {
    _id: string;
    title?: string | undefined;
    price: number;
    isOutOfStock?: boolean;
  },
>({
  title,
  options,
  name,
  multiple = false,
  singleSelected,
  onSingleSelect,
  multiSelected,
  onMultiSelect,
  requiredTag,
  showTag = false,
}: SectionProps<T>) => {
  const handleSelect = (option: T) => {
    if (option.isOutOfStock) {
      return;
    }
    if (multiple) {
      onMultiSelect &&
        onMultiSelect((prevSelected) => {
          const exists = (prevSelected as T[]).some(
            (o) => o._id === option._id
          );
          return exists
            ? (prevSelected as T[]).filter((o) => o._id !== option._id)
            : [...(prevSelected as T[]), option];
        });
    } else {
      onSingleSelect && onSingleSelect(option);
    }
  };
  const filteredMultiSelected = multiSelected
    ? (multiSelected as T[]).filter((item) => !item.isOutOfStock)
    : [];

  const t = useTranslations();
  const { CURRENCY_SYMBOL } = useConfig();

  return (
    <div className="mb-4 dark:bg-gray-800 dark:rounded-lg dark:p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-inter font-bold text-[14px] md:text-[16px] lg:text-[18px] leading-[20px] md:leading-[22px] dark:text-white">
          {title}
        </h3>

        {}
        {showTag && requiredTag && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white">
            {requiredTag}
          </span>
        )}
      </div>
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <label
            key={option._id}
            className="flex items-center gap-x-2 w-full cursor-pointer"
          >
            {}
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              checked={
                multiple
                  ? filteredMultiSelected.some((o) => o._id === option._id)
                  : singleSelected && !option.isOutOfStock
                    ? (singleSelected as Option | null)?._id === option._id
                    : false
              }
              onChange={() => handleSelect(option)}
              disabled={option.isOutOfStock}
              className="accent-sky-600 dark:accent-sky-400 dark:bg-gray-700 dark:border-gray-600 "
            />

            {}
            <div className="flex justify-between items-center w-full">
              <span className="text-sm text-gray-900 dark:text-white">
                {option.title}{" "}
                {option.isOutOfStock ? (
                  <span className="text-red-500 dark:text-red-400">
                    {t("out_of_stock_label")}
                  </span>
                ) : (
                  ""
                )}{" "}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {CURRENCY_SYMBOL || "$"}
                {option.price}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
