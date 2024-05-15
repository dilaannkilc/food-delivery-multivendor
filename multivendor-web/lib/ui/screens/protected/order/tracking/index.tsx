"use client";

import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import GoogleMapTrackingComponent from "@/lib/ui/screen-components/protected/order-tracking/components/gm-tracking-comp";
import TrackingOrderDetails from "../../../../screen-components/protected/order-tracking/components/tracking-order-details";
import TrackingHelpCard from "../../../../screen-components/protected/order-tracking/components/tracking-help-card";
import TrackingStatusCard from "@/lib/ui/screen-components/protected/order-tracking/components/tracking-status-card";
import TrackingOrderDetailsDummy from "../../../../screen-components/protected/order-tracking/components/tracking-order-details-dummy";

import useLocation from "@/lib/ui/screen-components/protected/order-tracking/services/useLocation";
import useTracking from "@/lib/ui/screen-components/protected/order-tracking/services/useTracking";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_REVIEW_ORDER, GET_USER_PROFILE } from "@/lib/api/graphql";
import useReviews from "@/lib/hooks/useReviews";
import { IReview } from "@/lib/utils/interfaces";
import useToast from "@/lib/hooks/useToast";
import { RatingModal } from "@/lib/ui/screen-components/protected/profile";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import ReactConfetti from "react-confetti";
import ChatRider from "@/lib/ui/screen-components/protected/order-tracking/components/ChatRider";

interface IOrderTrackingScreenProps {
  orderId: string;
}

export default function OrderTrackingScreen({
  orderId,
}: IOrderTrackingScreenProps) {

  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showChat, setShowChat] = useState(false)

  const {
    isLoaded,
    origin,
    destination,
    directions,
    setDirections,
    directionsCallback,
    store_user_location_cache_key,
    isCheckingCache,
    setIsCheckingCache,
  } = useLocation();
  const {
    orderTrackingDetails,
    isOrderTrackingDetailsLoading,
    subscriptionData,
  } = useTracking({ orderId: orderId });



  const { showToast } = useToast();

  const { data: profile } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: "cache-only",
  });

  const [mutate] = useMutation(ADD_REVIEW_ORDER, {
    onCompleted,
    onError,
  });

  function onCompleted() {
    showToast({
      type: "success",
      title: "Rating",
      message: "Rating submitted successfully",
      duration: 3000,
    });


    setTimeout(() => {
      window.location.href = "/profile/order-history";
    }, 1000); 
  }

  function onError() {
    showToast({
      type: "error",
      title: "Rating",
      message: "Failed to submit rating",
      duration: 3000,
    });
  }

  let mergedOrderDetails =
    orderTrackingDetails && subscriptionData ?
      {
        ...orderTrackingDetails,
        orderStatus:
          subscriptionData.orderStatus || orderTrackingDetails.orderStatus,
        rider: subscriptionData.rider || orderTrackingDetails.rider,
        completionTime:
          subscriptionData.completionTime ||
          orderTrackingDetails.completionTime,
      }
      : orderTrackingDetails;

  if (mergedOrderDetails?.orderStatus === "PICKUP") {
    mergedOrderDetails = {
      ...mergedOrderDetails,
      orderStatus: "PICKED",
    };
  }

  const restaurantId = useMemo(
    () => mergedOrderDetails?.restaurant?._id,
    [mergedOrderDetails?.restaurant?._id]
  );

  const { data: reviewsData, refetch } = useReviews(restaurantId);


  const hasUserReview = useMemo(() => {
    if (
      !reviewsData?.reviewsByRestaurant?.reviews ||
      !profile?.profile?.email
    ) {
      return false;
    }
    return reviewsData.reviewsByRestaurant.reviews.some(
      (review: IReview) =>
        review?.order?.user?.email === profile.profile.email &&
        review?.order?._id === orderId
    );
  }, [
    reviewsData?.reviewsByRestaurant?.reviews,
    profile?.profile?.email,
    orderId,
  ]);

  const onInitDirectionCacheSet = () => {
    try {
      const stored_direction = onUseLocalStorage(
        "get",
        store_user_location_cache_key
      );
      if (stored_direction) {
        setDirections(JSON.parse(stored_direction));
      }
      setIsCheckingCache(false); 
    } catch (err) {
      setIsCheckingCache(false);
    } finally {
      setIsCheckingCache(false);
    }
  };

  const handleSubmitRating = async (
    orderId: string | undefined,
    ratingValue: number,
    comment?: string,
    aspects: string[] = []
  ) => {
    const reviewDescription = comment?.trim() || undefined;
    const reviewComments =
      aspects?.filter(Boolean).join(", ") || undefined;

    try {
      await mutate({
        variables: {
          order: orderId,
          description: reviewDescription,
          rating: ratingValue,
          comments: reviewComments,
        },
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
    }

    setShowRatingModal(false);
  };


  useEffect(() => {
    if (mergedOrderDetails?.orderStatus == 'PICKED') {
      setShowChat(true)
    }

    if (mergedOrderDetails?.orderStatus == "DELIVERED") {

      const timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 4000); 
      return () => clearTimeout(timer); 
    } else if (mergedOrderDetails?.orderStatus == "ACCEPTED") {
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [mergedOrderDetails?.orderStatus]);

  useEffect(() => {
    if (mergedOrderDetails?.restaurant?._id) {
      refetch();
    }
  }, [mergedOrderDetails?.restaurant?._id, isOrderTrackingDetailsLoading]);

  useEffect(() => {
    onInitDirectionCacheSet();
  }, [store_user_location_cache_key]);

  return (
    <>
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
            <ReactConfetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={1000}
              gravity={0.3}
            />
          </div>
        </>
      )}
      <RatingModal
        visible={showRatingModal && !hasUserReview}
        onHide={() => setShowRatingModal(false)}
        order={orderTrackingDetails}
        onSubmitRating={handleSubmitRating}
      />
      <div className="w-screen h-full flex flex-col pb-20 dark:bg-gray-900 dark:text-gray-100">
        <div className="scrollable-container flex-1">
          {}
          <GoogleMapTrackingComponent
            isLoaded={isLoaded}
            origin={origin}
            destination={destination}
            directions={directions}
            isCheckingCache={isCheckingCache}
            directionsCallback={directionsCallback}
            orderStatus={mergedOrderDetails?.orderStatus || "PENDING"}
            riderId={mergedOrderDetails?.rider?._id}
          />

          {}
          <div className="mt-8 md:mt-10">
            <PaddingContainer>
              {}
              <div className="flex flex-col md:flex-row md:items-start items-center justify-between gap-6 mb-8">
                {}
                {!isOrderTrackingDetailsLoading && mergedOrderDetails && (
                  <TrackingStatusCard
                    orderTrackingDetails={mergedOrderDetails}
                  />
                )}

                {}
                <div className="md:ml-0 w-full md:w-auto md:flex-none">
                  <TrackingHelpCard />
                  {showChat &&
                    <ChatRider orderId={orderId} customerId={profile?.profile._id} />

                  }
                </div>
              </div>

              {}
              <div className="flex justify-center md:justify-start">
                {isOrderTrackingDetailsLoading ?
                  <TrackingOrderDetailsDummy />
                  : <TrackingOrderDetails
                    orderTrackingDetails={mergedOrderDetails}
                  />
                }
              </div>
            </PaddingContainer>
          </div>
        </div>
      </div>
    </>
  );
}
