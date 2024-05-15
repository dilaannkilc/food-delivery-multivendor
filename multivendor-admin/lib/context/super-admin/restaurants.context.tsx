'use client';

import { createContext, useState } from 'react';

import {
  IRestaurantsContextPropData,
  IRestaurantsContextProps,
  IRestaurantsProvider,
} from '@/lib/utils/interfaces';
import { RESTAURANTS_TABS } from '../../utils/constants';


export const RestaurantsContext = createContext({} as IRestaurantsContextProps);

export const RestaurantsProvider = ({ children }: IRestaurantsProvider) => {

  const [isRestaurantsFormVisible, setRestaurantsFormVisible] =
    useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>(RESTAURANTS_TABS[0]);

  const [restaurantsContextData, setRestaurantsContextData] =
    useState<IRestaurantsContextPropData | null>({
      restaurant: {
        _id: null,
      },
      vendor: {
        _id: null,
      },
      isEditing: false,
    });

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onRestaurantsFormVisible = (status: boolean) => {
    setRestaurantsFormVisible(status);
  };

  const onActiveStepChange = (activeStep: number) => {
    setActiveIndex(activeStep);
  };

  const onClearRestaurntsData = () => {
    setActiveIndex(0);
  };

  const onSetRestaurantsContextData = (vendor: IRestaurantsContextPropData) => {
    setRestaurantsContextData(vendor);
  };

  const onSetCurrentTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const value: IRestaurantsContextProps = {

    isRestaurantsFormVisible,
    onRestaurantsFormVisible,

    activeIndex,
    onActiveStepChange,

    onClearRestaurntsData,

    restaurantsContextData,
    onSetRestaurantsContextData,

    currentTab,
    onSetCurrentTab,
  };

  return (
    <RestaurantsContext.Provider value={value}>
      {children}
    </RestaurantsContext.Provider>
  );
};
