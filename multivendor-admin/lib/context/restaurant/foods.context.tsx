'use client';

import { createContext, useState } from 'react';

import {
  IFoodContextPropData,
  IFoodContextProps,
  IFoodNew,
  IFoodProvider,
  IVariationForm,
} from '@/lib/utils/interfaces';


export const FoodsContext = createContext({} as IFoodContextProps);

export const FoodsProvider = ({ children }: IFoodProvider) => {

  const [isFoodFormVisible, setFoodFormVisible] = useState<boolean>(false);

  const [foodContextData, setFoodContextData] =
    useState<IFoodContextPropData | null>({
      food: {
        _id: '',
        data: {} as IFoodNew,
        variations: [] as IVariationForm[],
      },
      isEditing: false,
    });

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onFoodFormVisible = (status: boolean) => {
    setFoodFormVisible(status);
  };

  const onActiveStepChange = (activeStep: number) => {
    setActiveIndex(activeStep);
  };

  const onClearFoodData = () => {
    setActiveIndex(0);
    onFoodFormVisible(false);
    onSetFoodContextData({
      food: {
        _id: '',
        data: {} as IFoodNew,
        variations: [] as IVariationForm[],
      },

      isEditing: false,
    });
  };

  const onSetFoodContextData = (data: Partial<IFoodContextPropData>) => {
    setFoodContextData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const value: IFoodContextProps = {

    isFoodFormVisible,
    onFoodFormVisible,

    activeIndex,
    onActiveStepChange,

    onClearFoodData,

    foodContextData,
    onSetFoodContextData,
  };

  return (
    <FoodsContext.Provider value={value}>{children}</FoodsContext.Provider>
  );
};
