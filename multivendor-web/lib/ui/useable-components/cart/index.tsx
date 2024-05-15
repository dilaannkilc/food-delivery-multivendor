"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useApolloClient } from "@apollo/client";
import { RELATED_ITEMS, FOOD } from "@/lib/api/graphql";

import useUser from "@/lib/hooks/useUser";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useRestaurant from "@/lib/hooks/useRestaurant";
import { IFood, IOpeningTime } from "@/lib/utils/interfaces";
import { Dialog } from "primereact/dialog";
import FoodItemDetail from "../item-detail";

interface CartProps {
  onClose?: () => void;
}

export default function Cart({ onClose }: CartProps) {

  const {
    clearCart,
    cart,
    cartCount,
    updateItemQuantity,
    calculateSubtotal,
    restaurant: restaurantId,
  } = useUser();

  const { CURRENCY_SYMBOL } = useConfig();
  const [instructions, setInstructions] = useState(
    localStorage.getItem("orderInstructions") || ""
  );
  const [showDialog, setShowDialog] = useState<IFood | null>(null);

  const slug = localStorage.getItem("cart-product-store-slug") || "";
  const id = localStorage.getItem("cart-product-store-id") || "";

  const { data } = useRestaurant(id, decodeURIComponent(slug));

  const router = useRouter();
  const t = useTranslations();
  const client = useApolloClient();
  const shopType = localStorage.getItem("currentShopType");

  const formattedSubtotal =
    cartCount > 0
      ? `${CURRENCY_SYMBOL}${calculateSubtotal()}`
      : `${CURRENCY_SYMBOL}0`;

  const firstCartItemId = cart.length > 0 ? cart[0]._id : null;

  const { data: relatedItemsData } = useQuery(RELATED_ITEMS, {
    variables: {
      itemId: firstCartItemId || "",
      restaurantId: restaurantId || "",
    },
    skip: !firstCartItemId || !restaurantId,
  });

  const handleClearCart = async () => {
    await clearCart();
  };














  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="text-center">
          <h2 className="font-inter font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2">
            {t("your_cart_is_empty")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t("add_items_to_cart_to_continue")}
          </p>
          <button
            onClick={async () => {
              if (onClose) {
                await onClose();
              }

              await new Promise((resolve) => setTimeout(resolve, 300));

              router.push("/discovery", { scroll: true });
            }}
            className="bg-primary-color text-black px-6 py-2 rounded-full font-medium"
            type="button"
          >
            {t("browse_restaurant")}
          </button>
        </div>
      </div>
    );
  }

  const getshopTypeTranslated = () => {
    if (shopType === "store") {
      return t("store_label");
    } else {
      return t("tab_restaurants");
    }
  };

  const slicedRelatedItems = (relatedItemsData?.relatedItems || []).slice(0, 3);
  const handleOpenFoodModal = async (food: IFood) => {
    if (food.isOutOfStock) return;

    if (
      !restaurantInfo?.isAvailable ||
      !restaurantInfo?.isActive ||
      !isWithinOpeningTime(restaurantInfo?.openingTimes)
    ) {
      return;
    }


    setShowDialog({
      ...food,
      restaurant: data?.restaurant?._id,
    });
  };

  const restaurantInfo = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    image: data?.restaurant?.image ?? "",
    reviewData: data?.restaurant?.reviewData ?? {},
    address: data?.restaurant?.address ?? "",
    deliveryCharges: data?.restaurant?.deliveryCharges ?? "",
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    isActive: data?.restaurant?.isActive ?? true,
  };

  const isWithinOpeningTime = (openingTimes: IOpeningTime[]): boolean => {
    const now = new Date();
    const currentDay = now
      .toLocaleString("en-US", { weekday: "short" })
      .toUpperCase(); 
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const todayOpening = openingTimes.find((ot) => ot.day === currentDay);
    if (!todayOpening) return false;

    return todayOpening.times.some(({ startTime, endTime }) => {
      const [startHour, startMinute] = startTime.map(Number);
      const [endHour, endMinute] = endTime.map(Number);

      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      const nowTotal = currentHour * 60 + currentMinute;

      return nowTotal >= startTotal && nowTotal <= endTotal;
    });
  };

  const handleCloseFoodModal = () => {
    setShowDialog(null);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-white dark:bg-gray-800 dark:text-white relative">
        {}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-inter font-semibold text-xl text-gray-900 dark:text-white">
            {t("your_order_label")}
          </h2>
          <span className="text-gray-500 dark:text-white text-sm">
            {cartCount} {cartCount === 1 ? t("item_label") : t("items_label")}
          </span>
        </div>

        {}
        <div className="flex-1 overflow-y-auto">
          {}
          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <div
                key={item.key}
                className="flex sm:flex-row sm:items-center bg-white dark:bg-gray-800 dark:text-white rounded-lg p-3 shadow-sm dark:shadow-gray-700"
              >
                <div className="flex-grow">
                  <div className="flex sm:flex-row flex-col sm:items-center gap-4">
                    <Image
                      src={item.image}
                      alt="item image"
                      width={112} 
                      height={112} 
                      className="w-28 h-28 object-cover rounded-md mb-2"
                    />
                    <div>
                      <h3 className="font-inter font-semibold text-sm text-gray-700 dark:text-white ">
                        {item.foodTitle || item.title || t("food_item_label")}
                      </h3>
                      <p className="text-secondary-color font-semibold text-sm">
                        {CURRENCY_SYMBOL}
                        {item.price || 0}
                      </p>
                    </div>
                  </div>
                  {item.optionTitles && item.optionTitles.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-white mt-1">
                      {item.optionTitles.map((title, index) => (
                        <span key={index} className="mr-2">
                          + {title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateItemQuantity(item.key, -1);
                    }}
                    className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faMinus} size="xs" />
                  </button>

                  <span className="text-gray-900 dark:text-white  w-6 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateItemQuantity(item.key, 1);
                    }}
                    className="bg-secondary-color text-white rounded-full w-6 h-6 flex items-center justify-center"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faPlus} size="xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {}
          {slicedRelatedItems.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 ">
              <h2 className="font-inter font-semibold text-base  text-gray-900 dark:text-white mb-3">
                {t("recommended_for_you_label")}
              </h2>
              <div className="flex flex-wrap gap-3">
                {slicedRelatedItems.map((id: string) => {

                  const food = client.readFragment({
                    id: `Food:${id}`,
                    fragment: FOOD,
                  });

                  if (!food) return null;
                  return (
                    <div
                      key={id}

                      onClick={() => handleOpenFoodModal(food)}
                      className="flex-grow basis-[calc(50%-0.75rem)] bg-white dark:bg-gray-800 rounded-lg overflow-hidden relative 
                    transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg cursor-pointer group"
                    >
                      {food.image && (
                        <Image
                          src={food.image}
                          alt={food.title}
                          width={600} 
                          height={144} 
                          className="w-full h-36 object-cover group-hover:opacity-80 transition-opacity duration-300"
                        />
                      )}
                      <div className="p-2">
                        <p className="text-sm font-semibold text-gray-700 dark:text-white truncate">
                          {food.title}
                        </p>
                        <p className="text-secondary-color text-sm font-semibold">
                          {CURRENCY_SYMBOL}
                          {food.variations[0].price}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {}
          <div className="p-4 bg-whitedark:bg-gray-800 ">
            <div className="bg-gray-50 dark:bg-gray-800  rounded-lg p-3">
              <h2 className="font-inter font-semibold text-base text-gray-900 dark:text-white  mb-2">
                {t("add_comment_for_restaurant_label")}{" "}
                {getshopTypeTranslated()}
              </h2>
              <textarea
                id="instructions"
                className="w-full h-20 p-2 bg-white dark:bg-gray-800 border border-gray-300 rounded-md resize-none focus:border-secondary-color focus:outline-none text-sm"
                placeholder={t("special_requests_placeholder")}
                onChange={({ target: { value } }) => {
                  if (value?.length > 500) return;
                  localStorage.setItem("orderInstructions", value);
                  setInstructions(value);
                }}
                value={instructions}
              />
              <div className="flex items-end justify-between mt-2">
                <span className="text-red-500 text-xs">
                  {instructions?.length >= 500 &&
                    t("maximum_limit_reached_label")}
                </span>
                <span className="text-xs text-gray-500 dark:text-white ">
                  {instructions.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="p-4 flex flex-col justify-center items-center border-t bg-white dark:bg-gray-800 ">
          <button
            className="flex justify-between items-center w-full bg-primary-color text-black rounded-full px-4 py-3"
            onClick={() => {
              router.push("/order/checkout");
              if (onClose) onClose();
            }}
            type="button"
          >
            <div className="flex items-center">
              <span className="bg-black text-primary-color rounded-full w-6 h-6 flex items-center justify-center mr-2 rtl:ml-2 text-sm font-medium">
                {cartCount}
              </span>
              <span className="text-black text-base font-medium">
                {t("go_to_checkout_label")}
              </span>
            </div>
            <span className="text-black text-base font-medium">
              {formattedSubtotal}
            </span>
          </button>
          {}
          <button
            onClick={handleClearCart}
            className="mt-3  w-full flex items-center justify-center gap-2 rounded-full px-4 py-3 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:border-red-700 dark:hover:bg-inherit transition-colors"
            type="button"
          >
            <span className="text-base font-medium">
            {t("clear_cart_button")}
            </span>
          </button>
        </div>
      </div>
      {}
      <Dialog
        visible={!!showDialog}
        className="mx-3 sm:mx-4 md:mx-0 " 
        onHide={handleCloseFoodModal}
        showHeader={false}
        contentStyle={{
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          padding: "0px",
        }} 
        style={{ borderRadius: "1rem" }} 
      >
        {showDialog && (
          <FoodItemDetail
            foodItem={showDialog}
            addons={data?.restaurant?.addons}
            options={data?.restaurant?.options}
            onClose={handleCloseFoodModal}
            isRecommendedProduct={true}
          />
        )}
      </Dialog>
    </>
  );
}
