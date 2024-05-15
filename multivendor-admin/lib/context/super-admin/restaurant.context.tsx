'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import {
  IProvider,
  IQueryResult,
  IRestaurantByOwner,
  IRestaurantContextData,
  IRestaurantContextProps,
  IRestaurantsByOwnerResponseGraphQL,
} from '@/lib/utils/interfaces';

import { GET_RESTAURANTS_BY_OWNER } from '@/lib/api/graphql';

import { useQueryGQL } from '@/lib/hooks/useQueryQL';

import { VendorContext } from './vendor.context';

import { onFilterObjects } from '@/lib/utils/methods';


export const RestaurantContext = createContext<IRestaurantContextProps>(
  {} as IRestaurantContextProps
);

export const RestaurantProvider = ({ children }: IProvider) => {

  const { vendorId } = useContext(VendorContext);

  const [restaurantContextData, setRestaurantContextData] =
    useState<IRestaurantContextData>({
      id: '',
      filtered: [] as IRestaurantByOwner[] | undefined,
      globalFilter: '',
      isEditing: false,
      autoCompleteAddress: '',
      unique_restaurant_id: '',
    });

  const [isRestaurantFormVisible, setRestaurantFormVisible] =
    useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isRestaurantModifed, setRestaurantModifed] = useState<boolean>(false);

  const restaurantByOwnerResponse = useQueryGQL(
    GET_RESTAURANTS_BY_OWNER,
    {
      id: vendorId,
    },
    {
      enabled: !!vendorId,
      debounceMs: 300,
      onCompleted: (data: unknown) => {
        const _data = data as IRestaurantsByOwnerResponseGraphQL;
        onSetRestaurantContextData({
          id: _data?.restaurantByOwner?.restaurants[0]?._id ?? '',
        });
      },
    }
  ) as IQueryResult<IRestaurantsByOwnerResponseGraphQL | undefined, undefined>;

  const onActiveStepChange = (activeStep: number) => {
    setActiveIndex(activeStep);
  };

  const onClearRestaurntsData = () => {
    setActiveIndex(0);
  };

  const onSetRestaurantFormVisible = (status: boolean) => {
    setRestaurantFormVisible(status);
  };

  const onSetRestaurantContextData = (
    data: Partial<IRestaurantContextData>
  ) => {
    setRestaurantContextData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const onHandlerFilterData = () => {
    const _filtered: IRestaurantByOwner[] = onFilterObjects(
      restaurantByOwnerResponse?.data?.restaurantByOwner?.restaurants ?? [],
      restaurantContextData?.globalFilter ?? '',
      ['name', 'address', 'shopType', 'unique_restaurant_id']
    );

    onSetRestaurantContextData({
      filtered: _filtered,
    });
  };

  useEffect(() => {
    onHandlerFilterData();
  }, [restaurantContextData?.globalFilter, isRestaurantModifed]);

  useEffect(() => {
    restaurantByOwnerResponse.refetch();
  }, [vendorId]);

  const value: IRestaurantContextProps = {

    vendorId,

    isRestaurantFormVisible,
    onSetRestaurantFormVisible,

    restaurantByOwnerResponse,
    restaurantContextData,
    onSetRestaurantContextData,

    activeIndex,
    onActiveStepChange,
    onClearRestaurntsData,
    isRestaurantModifed,
    setRestaurantModifed,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};
