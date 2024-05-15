"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";

import RenderStepTwo from "../step-two";
import RenderStepOne from "../step-one";
import RenderStepThree from "../step-three";

import CustomDialog from "@/lib/ui/useable-components/custom-dialog";

import { IRatingModalProps } from "@/lib/utils/interfaces/ratings.interface";
import { useTranslations } from "next-intl";


export default function RatingModal({
  visible,
  onHide,
  order,
  onSubmitRating,
}: IRatingModalProps) {

  const [step, setStep] = useState<1 | 2 | 3>(1); 
  const [rating, setRating] = useState<number | null>(null); 
  const [comment, setComment] = useState<string>(""); 
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]); 

  const t = useTranslations();

  const handleSubmitDebounced = useDebounceFunction(() => {
    if (order && rating !== null) {
      onSubmitRating(order._id, rating, comment, selectedAspects);
      onHide();
    }
  }, 500);

  useEffect(() => {
    if (visible) {
      setStep(1);
      setRating(null);
      setComment("");
      setSelectedAspects([]);
    }
  }, [visible]);

  const handleRatingSelect = (value: number) => {
    setRating(value);
  };

  const handleAspectToggle = (aspect: string) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect)
        ? prev.filter((a) => a !== aspect)
        : [...prev, aspect]
    );
  };

  const handleNext = () => {
    if (step === 1 && rating !== null) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  return (
    <CustomDialog
      visible={visible}
      onHide={onHide}
      className="m-0"
      width="594px"
    >
      <div className="flex flex-col items-center md:p-6 p-0 pt-16 rounded-xl gap-4">
        {}
        <div className="w-[162px] h-[162px] rounded-full overflow-hidden mb-4">
          {order?.restaurant?.image ? (
            <Image
              src={order.restaurant.image}
              alt={order.restaurant.name || t("restaurant_label")}
              width={162}
              height={162}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Image
                src="https://placehold.co/600x400"
                alt={t("restaurant_label")}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {}
        <p className="text-gray-600 dark:text-gray-400 ">
          {order?.restaurant?.name || t("restaurant_name_label")}
        </p>

        {}
        <h2 className="md:text-2xl text-xl font-bold  text-black dark:text-white">
          {t("how_was_the_delivery_title")}
        </h2>

        {}
        <p className="text-gray-600  dark:text-gray-400  text-center md:text-lg text-base">
          {t("rating_modal_description")}
        </p>

        {}
        {}
        {step === 1 && (
          <RenderStepOne
            rating={rating}
            handleRatingSelect={handleRatingSelect}
            handleNext={handleNext}
          />
        )}
        {}
        {step === 2 && (
          <RenderStepTwo
            selectedAspects={selectedAspects}
            handleAspectToggle={handleAspectToggle}
            handleNext={handleNext}
            handleSubmitDebounced={handleSubmitDebounced}
          />
        )}
        {}
        {step === 3 && (
          <RenderStepThree
            selectedAspects={selectedAspects}
            handleAspectToggle={handleAspectToggle}
            handleSubmitDebounced={handleSubmitDebounced}
            comment={comment}
            setComment={setComment}
          />
        )}
      </div>
    </CustomDialog>
  );
}
