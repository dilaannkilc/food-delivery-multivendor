"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { Skeleton } from "primereact/skeleton";
import { useMutation } from "@apollo/client";
import { ADD_FAVOURITE_RESTAURANT } from "@/lib/api/graphql/mutations/restaurant";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { useQuery } from "@apollo/client";

import useUser from "@/lib/hooks/useUser";
import useRestaurant from "@/lib/hooks/useRestaurant";

import { ClockSvg, HeartSvg, InfoSvg, RatingSvg } from "@/lib/utils/assets/svg";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

import Spacer from "@/lib/ui/useable-components/spacer";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import CustomIconTextField from "@/lib/ui/useable-components/input-icon-field";
import FoodItemDetail from "@/lib/ui/useable-components/item-detail";
import FoodCategorySkeleton from "@/lib/ui/useable-components/custom-skeletons/food-items.skeleton";
import ClearCartModal from "@/lib/ui/useable-components/clear-cart-modal";
import Confetti from "react-confetti";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import EmptySearch from "@/lib/ui/useable-components/empty-search-results";

import { ICategory, IFood, IOpeningTime } from "@/lib/utils/interfaces";

import { toSlug } from "@/lib/utils/methods";
import ChatSvg from "@/lib/utils/assets/svg/chat";
import ReviewsModal from "@/lib/ui/useable-components/reviews-modal";
import InfoModal from "@/lib/ui/useable-components/info-modal";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";

import { GET_POPULAR_SUB_CATEGORIES_LIST } from "@/lib/api/graphql";
import { Dialog } from "primereact/dialog";
import Loader from "@/app/(localized)/mapview/[slug]/components/Loader";
import { motion } from "framer-motion";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function RestaurantDetailsScreen() {

  const {
    cart,
    transformCartWithFoodInfo,
    updateCart,
    restaurant: cartRestaurant,
    clearCart,
  } = useUser();

  const { id, slug }: { id: string; slug: string } = useParams();

  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const selectedCategoryRef = useRef<string>("");

  const direction = document.documentElement.getAttribute("dir") || "ltr";

  const [filter, setFilter] = useState("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<IFood | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState<boolean>(false);
  const [pendingRestaurantAction, setPendingRestaurantAction] =
    useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { CURRENCY_SYMBOL } = useConfig();
  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });

  const { profile } = useUser();

  const { data, loading } = useRestaurant(id, decodeURIComponent(slug));

  const { data: popularSubCategoriesList } = useQuery(
    GET_POPULAR_SUB_CATEGORIES_LIST,
    {
      variables: {
        restaurantId: id,
      },
    },
  );

  useEffect(() => {
    if (data?.restaurant && cart.length > 0) {
      const transformedCart = transformCartWithFoodInfo(cart, data.restaurant);
      if (JSON.stringify(transformedCart) !== JSON.stringify(cart)) {
        updateCart(transformedCart);
      }
    }
  }, [data?.restaurant, cart?.length, transformCartWithFoodInfo, updateCart]);

  const allDeals = data?.restaurant?.categories?.filter(
    (cat: ICategory) => cat.foods.length,
  );

  useEffect(() => {
    if (profile?.favourite) {
      const isFavorite = profile.favourite.includes(id);
      setIsLiked(isFavorite);
    }
  }, [profile, id]);

  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        setIsModalOpen({ value, id });
      }
    },
    [isModalOpen],
  );

  const popularDealsIds = popularSubCategoriesList?.popularItems?.map(
    (item: any) => item.id,
  );

  const deals = useMemo(() => {
    const filteredDeals =
      (allDeals || [])
        .filter((c: ICategory) => {
          if (filter.trim() === "") return true;

          const categoryMatches = c.title
            .toLowerCase()
            .includes(filter.toLowerCase());
          const foodsMatch = c.foods.some((food: IFood) =>
            food.title.toLowerCase().includes(filter.toLowerCase()),
          );

          return categoryMatches || foodsMatch;
        })
        .map((c: ICategory, index: number) => ({
          ...c,
          index,
          foods: c.foods.filter((food) => {

            if (filter.trim() === "") return true;

            return (
              food.title.toLowerCase().includes(filter.toLowerCase()) ||
              (food.description &&
                food.description.toLowerCase().includes(filter.toLowerCase()))
            );
          }),
        }))
        .filter((c: ICategory) => c.foods.length > 0) || [];

    const allFoods = filteredDeals.flatMap((cat: ICategory) => cat.foods);

    const popularFoods = allFoods.filter((food: IFood) =>
      popularDealsIds?.includes(food._id),
    );

    const popularDealsCategory: ICategory | null = popularFoods.length
      ? {
          _id: "popular-deals",
          title: "Popular Deals",
          foods: popularFoods,

        }
      : null;

    return popularDealsCategory
      ? [popularDealsCategory, ...filteredDeals]
      : filteredDeals;
  }, [allDeals, filter, popularDealsIds]);

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (deals.length > 0 && !selectedCategory) {
      setSelectedCategory(toSlug(deals[0]?.title)); 
    }
  }, [deals, selectedCategory]);

  const [addFavorite, { loading: addFavoriteLoading }] = useMutation(
    ADD_FAVOURITE_RESTAURANT,
    {
      onCompleted: () => {
        const wasLiked = isLiked;
        setIsLiked(!isLiked);

        if (!wasLiked) {
          setShowConfetti(true);

          setTimeout(() => {
            setShowConfetti(false);
          }, 5000); 
        }
      },
      onError: (error) => {
        console.error("Error adding favorite:", error);
        setIsLiked((prev) => !prev); 
      },
      refetchQueries: [{ query: GET_USER_PROFILE }],
    },
  );

  const t = useTranslations();
  const handleFavoriteClick = () => {
    if (!profile) {

      return;
    }

    addFavorite({
      variables: {
        id: id,
      },
    });
  };

  const headerData = {
    name: data?.restaurant?.name ?? "...",
    averageReview: data?.restaurant?.reviewData?.ratings ?? "...",
    averageTotal: data?.restaurant?.reviewData?.total ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    deals: deals,
    deliveryTime: data?.restaurant?.deliveryTime,
  };

  const restaurantInfo = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    image: data?.restaurant?.image ?? "",
    logo: data?.restaurant?.logo ?? "",
    deals: deals,
    reviewData: data?.restaurant?.reviewData ?? {},
    address: data?.restaurant?.address ?? "",
    deliveryCharges: data?.restaurant?.deliveryCharges ?? "",
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    isActive: data?.restaurant?.isActive ?? true,
  };

  const restaurantInfoModalProps = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    username: data?.restaurant?.username ?? "N/A",
    phone: data?.restaurant?.phone ?? "N/A",
    address: data?.restaurant?.address ?? "N/A",
    location: data?.restaurant?.location ?? "N/A",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    description: data?.restaurant?.description ?? t("restaurant_modal_label"),
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    deliveryTax: data?.restaurant?.deliveryTax ?? 0,
    MinimumOrder: data?.restaurant?.MinimumOrder ?? 0,
  };

  const [visibleItems, setVisibleItems] = useState(10); 
  const [showAll, setShowAll] = useState(false);
  const [headerHeight, setHeaderHeight] = useState("64px"); 
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

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

  const handleRestaurantClick = (food: IFood) => {
    if (food.isOutOfStock) return;
    if (
      !restaurantInfo?.isAvailable ||
      !restaurantInfo?.isActive ||
      !isWithinOpeningTime(restaurantInfo?.openingTimes)
    ) {

      handleUpdateIsModalOpen(true, food?._id);
      return;
    }

    if (cart.length > 0 && cartRestaurant && id !== cartRestaurant) {

      setPendingRestaurantAction({
        type: "foodModal",
        payload: food,
      });

      setShowClearCartModal(true);
    } else {

      handleOpenFoodModal(food);
    }
  };

  const handleClearCartConfirm = async () => {
    await clearCart();

    if (pendingRestaurantAction) {
      if (pendingRestaurantAction.type === "foodModal") {
        handleOpenFoodModal(pendingRestaurantAction.payload);
      }

      setPendingRestaurantAction(null);
    }

    onUseLocalStorage("save", "restaurant", data?.restaurant?._id);
    onUseLocalStorage("save", "restaurant-slug", data?.restaurant?.slug);
    onUseLocalStorage(
      "save",
      "currentShopType",
      data?.restaurant?.shopType === "restaurant" ? "restaurant" : "store",
    );

    setShowClearCartModal(false);
  };

  const handleScroll = (id: string) => {
    setSelectedCategory(id);
    selectedCategoryRef.current = id;
    const element = document.getElementById(id);
    const container = document.body;

    if (element && container) {
      const headerOffset = 120;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      container.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleOpenFoodModal = (food: IFood) => {

    setSelectedFood({
      ...food,
      restaurant: restaurantInfo._id,
    });
    setShowDialog(true);
    console.log("Food ModAL dETAISL", food);
  };

  const handleCloseFoodModal = () => {
    setShowDialog(false);
    setSelectedFood(null);
  };

  const handleSeeReviews = () => {
    setShowReviews(true);
  };

  const handleSeeMoreInfo = () => {
    setShowMoreInfo(true);
  };

  useEffect(() => {

    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(3); 
      } else if (width < 1024) {
        setVisibleItems(4); 
      } else {
        setVisibleItems(5); 
      }
    };

    const updateHeight = () => {
      if (window.innerWidth >= 1024)
        setHeaderHeight("64px"); 
      else if (window.innerWidth >= 768)
        setHeaderHeight("80px"); 
      else if (window.innerWidth >= 640)
        setHeaderHeight("100px"); 
      else setHeaderHeight("120px"); 
    };

    updateHeight();
    updateVisibleItems();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("resize", updateVisibleItems);

    return () => {
      window.removeEventListener("resize", updateVisibleItems);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const handleScrollUpdate = () => {
      const container = document.body;
      if (!container) return;

      let selected = "";
      deals.forEach((category) => {
        const element = document.getElementById(toSlug(category.title));
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            selected = toSlug(category.title);
          }
        }
      });

      if (selected && selected !== selectedCategoryRef.current) {
        setSelectedCategory(selected);
        selectedCategoryRef.current = selected;
      }
    };

    const container = document.body;
    container?.addEventListener("scroll", handleScrollUpdate);

    return () => {
      container?.removeEventListener("scroll", handleScrollUpdate);
    };
  }, [deals]);

  return (
    <>
      {}
      <ReviewsModal
        restaurantId={id}
        visible={showReviews && !loading}
        onHide={() => setShowReviews(false)}
      />

      {}
      <InfoModal
        restaurantInfo={restaurantInfoModalProps}

        visible={showMoreInfo && !loading}
        onHide={() => setShowMoreInfo(false)}
      />

      {}
      <ClearCartModal
        isVisible={showClearCartModal}
        onHide={() => setShowClearCartModal(false)}
        onConfirm={handleClearCartConfirm}
      />
      {showConfetti && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
              zIndex: 10000, 
            }}
          >
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={1000}
              gravity={0.3}
            />
          </div>
          {}
        </>
      )}

      {}
      <div className="relative">
        {loading ? (
          <Skeleton width="100%" height="18rem" borderRadius="0" />
        ) : (
          <div className="relative">
            <Image
              src={restaurantInfo.image}
              alt="McDonald's banner with a burger and fries"
              width={1200}
              height={300}
              className="w-full h-72 object-cover"
            />
            {}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        )}

        {!loading && (
          <div
            className={`${direction === "rtl" ? "right-0 md:right-20" : "left-0 md:left-20"} absolute bottom-0  p-4`}
          >
            <div className="flex flex-col items-start">
              <Image
                src={restaurantInfo.logo}
                alt={`${restaurantInfo.name} logo`}
                width={50}
                height={50}
                className="w-12 h-12 mb-2 object-cover"
              />

              <div className="text-white space-y-2">
                <h1 className="font-inter font-extrabold text-[32px] leading-[100%] sm:text-[40px] md:text-[48px]">
                  {restaurantInfo.name}
                </h1>
                <p className="font-inter font-medium text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px] md:text-[24px] md:leading-[32px]">
                  {restaurantInfo.address}
                </p>
              </div>
            </div>
          </div>
        )}
        <button
          disabled={addFavoriteLoading}
          onClick={handleFavoriteClick}
          className={`absolute top-4 ${direction === "rtl" ? "left-4 md:left-4" : "right-4 md:right-4"} md:bottom-4 md:top-auto rounded-full bg-white dark:bg-gray-700 h-8 w-8 flex justify-center items-center transform transition-transform duration-300 hover:scale-110 active:scale-95`}
        >
          {addFavoriteLoading ? (
            <Loader style={{ width: "1.5rem", height: "1.5rem" }} />
          ) : (
            <HeartSvg filled={isLiked} />
          )}
        </button>
      </div>
      {}
      <div className="bg-gray-50 dark:bg-gray-800 shadow-[0px_1px_3px_rgba(0,0,0,0.1)] p-3 h-[80px] flex justify-between items-center">
        <PaddingContainer>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {}
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
              <ClockSvg />
              {loading ? (
                <Skeleton width="1rem" height="1.5rem" />
              ) : (
                `${headerData.deliveryTime} mins`
              )}
            </span>

            {}
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300  font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
              <RatingSvg />
              {loading ? (
                <Skeleton width="1rem" height="1.5rem" />
              ) : (
                headerData.averageReview
              )}
            </span>

            {}
            <a
              className="flex items-center gap-2 text-secondary-color dark:text-sky-400 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSeeMoreInfo();
              }}
            >
              <InfoSvg />
              {loading ? (
                <Skeleton width="10rem" height="1.5rem" />
              ) : (
                t("see_more_information")
              )}
            </a>

            {}
            <a
              className="flex items-center gap-2 text-secondary-color dark:text-sky-400 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSeeReviews();
              }}
            >
              <ChatSvg />
              {loading ? (
                <Skeleton width="10rem" height="1.5rem" />
              ) : (
                t("see_reviews")
              )}
            </a>
          </div>
        </PaddingContainer>
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:top-[60px] top-[95px] sticky z-50 bg-white dark:bg-gray-900 shadow-[0_1px_1px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_1px_rgba(255,255,255,0.05)]"
      >
        <PaddingContainer height={headerHeight}>
          <div className="p-3 h-full w-full flex flex-col md:flex-row gap-2 items-center justify-between">
            {}
            <div className="relative w-full md:w-[80%]">
              <div
                className="h-12 w-full overflow-x-auto overflow-y-hidden flex items-center 
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <ul className="flex space-x-4 items-center w-max flex-nowrap">
                  {(showAll ? deals : deals.slice(0, visibleItems)).map(
                    (category: ICategory, index: number) => {
                      const _slug = toSlug(category.title);
                      return (
                        <li key={index} className="shrink-0">
                          <button
                            type="button"
                            className={`${
                              selectedCategory === _slug
                                ? "bg-primary-light text-primary-color dark:bg-[#2E3B23] dark:text-[#D2F29E]"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            } rounded-full px-3 py-2 text-[10px] sm:text-sm md:text-base font-medium whitespace-nowrap`}
                            onClick={() => handleScroll(toSlug(category.title))}
                          >
                            {category.title}
                          </button>
                        </li>
                      );
                    },
                  )}

                  {!showAll && deals.length > visibleItems && (
                    <li className="shrink-0">
                      <button
                        type="button"
                        className="bg-blue-500 text-white dark:bg-blue-600 rounded-full px-4 py-2 font-medium text-[14px] cursor-pointer"
                        onClick={() => setShowAll(true)}
                      >
                        {t("more_button")}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {}
            <div className="h-full w-full md:w-[20%]">
              {
                <CustomIconTextField
                  value={filter}
                  className="w-full md:h-10 h-9 rounded-full pl-10 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  iconProperties={{
                    icon: faSearch,
                    position: "left",
                    style: { marginTop: "-10px" },
                  }}
                  placeholder={t("search_for_food_items_placeholder")}
                  type="text"
                  name="search"
                  showLabel={false}
                  isLoading={loading}
                  onChange={(e) => setFilter(e.target.value)}
                />
              }
            </div>
          </div>
        </PaddingContainer>
      </motion.div>

      <Spacer height="20px" />

      {}
      <PaddingContainer className="pb-10">
        {loading ? (
          <FoodCategorySkeleton />
        ) : (
          deals.map((category: ICategory, catIndex: number) => {
            const categorySlug = toSlug(category.title);

            return (
              <div
                key={catIndex}
                className="mb-4 p-3"
                id={categorySlug}
                data-category-id={categorySlug}
                ref={(el) => {
                  categoryRefs.current[categorySlug] = el;
                }}
              >
                <h2 className="mb-4 font-inter text-gray-900 dark:text-gray-100 font-bold text-2xl sm:text-xl leading-snug tracking-tight">
                  {category.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {category.foods.map((meal: IFood, mealIndex) => (
                    <div
                      key={mealIndex}
                      className="flex gap-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 p-3 relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={() => handleRestaurantClick(meal)}
                    >
                      {}
                      <div className="flex-grow text-left md:text-left space-y-2">
                        <div className="flex flex-col lg:flex-row justify-between flex-wrap">
                          <h3 className="text-gray-900 dark:text-gray-100  text-lg font-semibold font-inter">
                            {meal.title}
                          </h3>
                          {meal.isOutOfStock && (
                            <span className="text-red-500">
                              {t("out_of_stock_label")}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-500 text-sm dark:text-gray-400 line-clamp-2 hover:line-clamp-none">
                          {meal.description}
                        </p>

                        <div className="flex items-center gap-2">
                          <span className="text-secondary-color dark:text-sky-400 text-lg font-semibold">
                            {CURRENCY_SYMBOL} {meal.variations[0].price}
                          </span>
                        </div>
                      </div>

                      {}
                      <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28">
                        <Image
                          alt={meal.title}
                          className="w-full h-full rounded-md object-cover mx-auto md:mx-0"
                          src={meal.image}
                          width={112}
                          height={112}
                        />
                      </div>

                      {}
                      <div
                        className={`${direction === "rtl" ? "left-2" : "right-2"} absolute top-2`}
                      >
                        <button
                          className="bg-secondary-color rounded-full shadow-md w-6 h-6 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleRestaurantClick(meal);
                          }}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faPlus} color="white" />
                        </button>
                      </div>

                      {}
                      <CustomDialog
                        className="max-w-[300px]"
                        visible={
                          isModalOpen.value &&
                          isModalOpen.id === meal?._id?.toString()
                        }
                        onHide={() =>
                          handleUpdateIsModalOpen(false, meal?._id?.toString())
                        }
                      >
                        <div className="text-center pb-10 pt-10">
                          <p className="text-lg font-bold pb-3 dark:text-gray-100">
                            {t("restaurant_is_closed")}
                          </p>
                          <p className="text-sm dark:text-gray-300">
                            {t("cannot_order_food_item_now")}
                            <br></br> {t("please_try_again_later")}
                          </p>
                        </div>
                      </CustomDialog>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        {!loading && deals.length == 0 && (
          <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
            <EmptySearch />
          </div>
        )}
      </PaddingContainer>

      {}
      <Dialog
        contentClassName="dark:bg-gray-800 dark:text-gray-300"
        headerClassName="dark:bg-gray-800 dark:text-gray-300"
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
        {selectedFood && (
          <FoodItemDetail
            foodItem={selectedFood}
            addons={data?.restaurant?.addons}
            options={data?.restaurant?.options}
            restaurant={data?.restaurant}
            onClose={handleCloseFoodModal}
          />
        )}
      </Dialog>
    </>
  );
}
