import { useEffect, useState } from "react";
import useUser from "@/lib/hooks/useUser";

import {
  IAddon,
  IFoodItemDetalComponentProps,
  Option,
} from "@/lib/utils/interfaces";

import Divider from "../custom-divider";
import { ItemDetailSection } from "./item-section";
import ClearCartModal from "../clear-cart-modal";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function FoodItemDetail(props: IFoodItemDetalComponentProps) {
  const {
    foodItem,
    addons,
    options,
    onClose,
    restaurant,
    isRecommendedProduct,
  } = props;
  const { CURRENCY_SYMBOL } = useConfig();
  const { id, slug }: { id: string; slug: string } = useParams();
  const locale = useLocale();

  const isRTL = ["ar", "he", "fa", "ur"].includes(locale);
  const direction = isRTL ? "rtl" : "ltr";

  const {
    addItem,
    restaurant: cartRestaurant,
    clearCart,
    cart,
    addQuantity,
  } = useUser();

  const [selectedVariation, setSelectedVariation] = useState(
    foodItem?.variations && foodItem.variations.length > 0
      ? foodItem.variations[0]
      : null,
  );

  const [quantity, setQuantity] = useState(1);

  const [selectedAddonOptions, setSelectedAddonOptions] = useState<
    Record<string, Option | Option[]>
  >({});

  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const variationAddons =
    selectedVariation?.addons
      ?.map((addonId) => addons?.find((a) => a._id === addonId))
      .filter(Boolean) || [];

  const getAddonOptions = (addon: IAddon | undefined) => {
    return (
      addon?.options
        ?.map((optionId) => options?.find((o) => o._id === optionId))
        .filter(Boolean) || []
    );
  };

  const handleAddonSelection = (
    addonId: string,
    isMultiple: boolean,
    selection: Option | Option[],
  ) => {
    setSelectedAddonOptions((prev) => ({
      ...prev,
      [addonId]: selection,
    }));
  };

  const t = useTranslations();

  const isFormValid = () => {

    if (!selectedVariation) return false;

    for (const addon of variationAddons) {
      if (!addon) continue; 

      const selected = selectedAddonOptions[addon._id ?? ""];

      if (addon.quantityMinimum && addon.quantityMinimum > 0) {

        if (addon.quantityMinimum === 1 && addon.quantityMaximum === 1) {
          if (!selected) return false;
        }

        else {
          const selectedCount = selected
            ? Array.isArray(selected)
              ? selected.length
              : 1
            : 0;
          if (
            selectedCount < (addon.quantityMinimum ?? 0) ||
            selectedCount > (addon.quantityMaximum ?? Infinity)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!isFormValid() || !foodItem || !selectedVariation) return;

    const needsClear =
      cart.length > 0 &&
      cartRestaurant &&
      foodItem.restaurant !== cartRestaurant;

    if (needsClear) {

      setShowClearCartModal(true);
      return;
    }

    addItemToCart();
  };

  const addItemToCart = () => {
    if (!foodItem || !selectedVariation) return;

    const formattedAddons = Object.entries(selectedAddonOptions)
      .filter(([, value]) => value) 
      .map(([addonId, optionOrOptions]) => {

        const options = Array.isArray(optionOrOptions)
          ? optionOrOptions.map((opt) => ({ _id: opt._id }))
          : [{ _id: optionOrOptions._id }];

        return {
          _id: addonId,
          options,
        };
      });

    const isItemInCart = cart.some(
      (item) =>
        item._id === foodItem._id &&
        item.variation._id === selectedVariation._id &&

        JSON.stringify(item.addons?.map((a) => a._id)) ===
          JSON.stringify(formattedAddons.map((a) => a._id)) &&
        JSON.stringify(
          item.addons?.flatMap((a) => a.options.map((o) => o._id)),
        ) ===
          JSON.stringify(
            formattedAddons.flatMap((a) => a.options.map((o) => o._id)),
          ),
    );

    if (isItemInCart) {
      cart.map((item) => {
        if (
          item._id === foodItem._id &&
          item.variation._id === selectedVariation._id &&

          JSON.stringify(item.addons?.map((a) => a._id)) ===
            JSON.stringify(formattedAddons.map((a) => a._id)) &&
          JSON.stringify(
            item.addons?.flatMap((a) => a.options.map((o) => o._id)),
          ) ===
            JSON.stringify(
              formattedAddons.flatMap((a) => a.options.map((o) => o._id)),
            )
        ) {

          addQuantity(item.key, quantity);
        }
      });
    } else {

      addItem(
        foodItem?.image,
        foodItem._id,
        selectedVariation._id,
        foodItem.restaurant,
        quantity,
        formattedAddons,

      );

      if (!isRecommendedProduct) {
        onUseLocalStorage("save", "cart-product-store-id", id);
        onUseLocalStorage("save", "cart-product-store-slug", slug);
      }
    }


    onUseLocalStorage("save", "restaurant", restaurant?._id);
    onUseLocalStorage("save", "restaurant-slug", restaurant?.slug);
    onUseLocalStorage(
      "save",
      "currentShopType",
      restaurant?.shopType === "restaurant" ? "restaurant" : "store",
    );

    if (onClose) {
      onClose();
    }
  };

  const handleClearCartConfirm = async () => {
    await clearCart();
    addItemToCart();
    setShowClearCartModal(false);

    onUseLocalStorage("save", "restaurant", restaurant?._id);
    onUseLocalStorage("save", "restaurant-slug", restaurant?.slug);
    onUseLocalStorage(
      "save",
      "currentShopType",
      restaurant?.shopType === "restaurant" ? "restaurant" : "store",
    );
  };

  const calculateTotalPrice = () => {
    if (!selectedVariation) return 0;

    let totalPrice = selectedVariation.price;

    Object.entries(selectedAddonOptions).forEach(([, selected]) => {
      if (!selected) return;

      if (Array.isArray(selected)) {

        selected.forEach((option) => {
          totalPrice += option.price;
        });
      } else {

        totalPrice += selected.price;
      }
    });

    totalPrice = totalPrice * quantity;

    return totalPrice.toFixed(2);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (foodItem?.variations && foodItem.variations.length > 0) {

      const inStockVariation = foodItem.variations.find(
        (variation) => !variation.isOutOfStock,
      );

      if (inStockVariation) {
        setSelectedVariation(inStockVariation);
      } else {

        setSelectedVariation(null);
      }
    }
  }, [foodItem]);

  return (
    <div className="bg-white md:max-w-md w-100 w-full relative dark:bg-gray-800 dark:text-gray-200">
      {}
      <button
        onClick={onClose}
        className={`${direction === "rtl" ? "left-3" : "right-3"} absolute top-3 bg-slate-400 hover:bg-slate-500 transition-all duration-300 rounded-full p-2`}
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="text-white"
          width={23}
          height={18}
        />
      </button>

      <div className="text-center mb-4">
        {isLoading && (
          <div className="md:max-w-md w-100 h-[200px] bg-gray-300 animate-pulse rounded-t-md mx-auto" />
        )}
        <Image
          alt={foodItem?.title ?? ""}
          className={`md:max-w-md w-100 h-[200px] object-cover object-center rounded-t-md transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          src={foodItem?.image ?? ""}
          width={500}
          height={200}
          onLoad={() => setIsLoading(false)}
        />
      </div>

      <div className="py-3 px-6 mb-4" dir={direction}>
        <h2 className="font-inter font-bold text-[#111827] dark:text-white text-[16px] md:text-[18px] lg:text-[19px] leading-[22px] md:leading-[24px]">
          {foodItem?.title}
        </h2>
        <p className="text-secondary-color font-[600] text-[14px] md:text-[15px] lg:text-[16px] mb-2">
          {CURRENCY_SYMBOL}
          {selectedVariation?.price.toFixed(2)}
        </p>
        <p className="font-inter font-normal text-gray-500 dark:text-gray-300 text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] md:leading-[20px]">
          {foodItem?.description}
        </p>

        <Divider />

        <div id="addon-sections">
          {}
          {foodItem?.variations && foodItem.variations.length > 0 && (
            <ItemDetailSection
              key="variations"
              title={`${t("select_variation")}`}
              name="variation" 
              singleSelected={selectedVariation}
              onSingleSelect={setSelectedVariation}
              options={foodItem?.variations || []}
              requiredTag={`1  ${t("required")}`}
              showTag={true}
            />
          )}

          {}
          {variationAddons.map((addon) => {
            if (!addon) return null; 

            const isSingleSelect = addon.quantityMaximum === 1;
            const addonOptions = getAddonOptions(addon);

            const requiredTagText =
              (addon.quantityMinimum ?? 0) > 0
                ? `${addon.quantityMinimum} ${t("required")}`
                : `${t("optional")}`;

            return (
              <ItemDetailSection
                key={addon._id ?? "addon-" + Math.random()}
                title={addon.title ?? "Unknown"}
                name={addon._id ?? "addon"}
                multiple={!isSingleSelect}
                singleSelected={
                  isSingleSelect
                    ? (selectedAddonOptions[addon._id ?? ""] as Option)
                    : null
                }
                onSingleSelect={
                  isSingleSelect
                    ? (option) =>
                        handleAddonSelection(
                          addon._id ?? "",
                          false,
                          option as Option,
                        )
                    : undefined
                }
                multiSelected={
                  !isSingleSelect
                    ? (selectedAddonOptions[addon._id ?? ""] as Option[]) || []
                    : []
                }
                onMultiSelect={
                  !isSingleSelect
                    ? (updateFn) => {
                        const current =
                          (selectedAddonOptions[addon._id ?? ""] as Option[]) ||
                          [];
                        if (typeof updateFn === "function") {
                          const updated = updateFn(current);
                          handleAddonSelection(
                            addon._id ?? "",
                            true,
                            updated as Option[],
                          );
                        }
                      }
                    : undefined
                }
                options={addonOptions as Option[]}
                requiredTag={requiredTagText}
                showTag={true}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-x-2 mt-4">
          {}
          <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-400 rounded-[42px] px-3 py-1 flex-[0.2]">
            <button
              className="bg-white text-black text-2xl rounded-full w-6 h-6 flex rtl:ml-2 items-center justify-center shadow"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              type="button"
            >
              -
            </button>
            <span className="text-lg font-medium text-gray-900">
              {quantity}
            </span>
            <button
              className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
              onClick={() => setQuantity((prev) => prev + 1)}
              type="button"
            >
              +
            </button>
          </div>

          {}
          <button
            className={`${isFormValid() ? "bg-primary-color" : "bg-gray-300"} text-black px-4 py-2 text-[500] font-[14px] rounded-full flex flex-col md:flex-row items-center justify-between flex-[0.8]`}
            onClick={handleAddToCart}
            disabled={!isFormValid()}
            type="button"
          >
            {t("add_to_order")}
            <span className="ml-2 text-gray-900 text-[500] font-[14px]">
              {CURRENCY_SYMBOL}
              {calculateTotalPrice()}
            </span>
          </button>
        </div>
      </div>

      {}
      <ClearCartModal
        isVisible={showClearCartModal}
        onHide={() => setShowClearCartModal(false)}
        onConfirm={handleClearCartConfirm}
      />
    </div>
  );
}
